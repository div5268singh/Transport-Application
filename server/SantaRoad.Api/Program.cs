using System.Text;
using System.Text.Json.Nodes;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SantaRoad.Api.Data;
using SantaRoad.Api.Models;
using SantaRoad.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ---- Services ----

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "satnaLogistics API",
        Version = "v1"
    });

    var jwtScheme = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Scheme = "bearer",
        BearerFormat = "JWT",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Description = "Paste just the JWT token (no 'Bearer ' prefix needed here)."
    };
    options.AddSecurityDefinition("Bearer", jwtScheme);
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        { new Microsoft.OpenApi.Models.OpenApiSecurityScheme { Reference = new Microsoft.OpenApi.Models.OpenApiReference { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" } }, Array.Empty<string>() }
    });
});

var sqlServerConnection = builder.Configuration.GetConnectionString("SqlServer")?.Trim();
var mySqlConnection = builder.Configuration.GetConnectionString("MySql")?.Trim();
var firestoreProjectId = builder.Configuration["Database:Firestore:ProjectId"]?.Trim();

if (!string.IsNullOrWhiteSpace(sqlServerConnection))
{
    builder.Services.AddDbContext<SantaRoadDbContext>(options =>
        options.UseSqlServer(sqlServerConnection, sqlOptions => sqlOptions.EnableRetryOnFailure()));
    AddEfCoreStore();
}
else if (!string.IsNullOrWhiteSpace(mySqlConnection))
{
    builder.Services.AddDbContext<SantaRoadDbContext>(options =>
        options.UseMySql(mySqlConnection, ServerVersion.AutoDetect(mySqlConnection)));
    AddEfCoreStore();
}
else if (!string.IsNullOrWhiteSpace(firestoreProjectId) && firestoreProjectId != "YOUR_FIREBASE_PROJECT_ID")
{
    builder.Services.AddSingleton(_ => FirestoreDb.Create(firestoreProjectId));
    builder.Services.AddScoped<ISantaRoadStore, FirestoreSantaRoadStore>();
    builder.Services.AddHealthChecks();
}
else
{
    throw new InvalidOperationException(
        "No database is configured. Supply ConnectionStrings:SqlServer, ConnectionStrings:MySql, or Database:Firestore:ProjectId.");
}

void AddEfCoreStore()
{
    builder.Services.AddScoped<ISantaRoadStore, EfCoreSantaRoadStore>();
    builder.Services.AddHealthChecks().AddDbContextCheck<SantaRoadDbContext>();
}

builder.Services.AddResponseCompression(options => options.EnableForHttps = true);
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(origin =>
                      Uri.TryCreate(origin, UriKind.Absolute, out var uri)
                      && uri.Host is "localhost" or "127.0.0.1");
        }
        else
        {
            var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
            if (allowedOrigins.Length > 0)
            {
                policy.WithOrigins(allowedOrigins);
            }
        }
        policy.AllowAnyHeader().AllowAnyMethod();
    });
});

var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException("Jwt:Key must be configured with at least 32 bytes.");
}
if (string.IsNullOrWhiteSpace(jwtIssuer))
{
    throw new InvalidOperationException("Jwt:Issuer must be configured.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            // Both admin and driver tokens are accepted here; the actual
            // audience distinction is enforced via [Authorize(Roles=...)]
            // on each controller, not via separate auth schemes.
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<CredentialGeneratorService>();

var app = builder.Build();

app.UseForwardedHeaders();
app.UseResponseCompression();

// ---- Seed admin user + auto-apply migrations on startup ----
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetService<SantaRoadDbContext>();
    db?.Database.Migrate();
    var store = scope.ServiceProvider.GetRequiredService<ISantaRoadStore>();

    var defaultsPath = Path.Combine(
        AppContext.BaseDirectory,
        "wwwroot",
        "assets",
        "config",
        "app.config.json");
    var siteContent = await store.GetSiteContentAsync();
    if (File.Exists(defaultsPath) && siteContent is null)
    {
        siteContent = new SiteContent
        {
            JsonData = File.ReadAllText(defaultsPath),
            UpdatedAt = DateTime.UtcNow,
        };
        await store.SaveSiteContentAsync(siteContent);
    }
    else if (File.Exists(defaultsPath) && siteContent is not null)
    {
        var storedJson = JsonNode.Parse(siteContent.JsonData) as JsonObject ?? new JsonObject();
        var defaultJson = JsonNode.Parse(File.ReadAllText(defaultsPath)) as JsonObject ?? new JsonObject();
        var contentChanged = AddMissingContent(storedJson, defaultJson);
        contentChanged |= ReplaceLegacyApplicationName(storedJson);
        if (contentChanged)
        {
            siteContent.JsonData = storedJson.ToJsonString();
            siteContent.UpdatedAt = DateTime.UtcNow;
            await store.SaveSiteContentAsync(siteContent);
        }
    }

    var seedUsername = builder.Configuration["AdminSeed:Username"]?.Trim();
    var seedPassword = builder.Configuration["AdminSeed:Password"];
    if (string.IsNullOrWhiteSpace(seedUsername) || string.IsNullOrWhiteSpace(seedPassword))
    {
        throw new InvalidOperationException("AdminSeed username and password must be configured.");
    }

    var seededAdmin = await store.GetAdminAsync(seedUsername);
    if (seededAdmin is null)
    {
        seededAdmin = new AdminUser
        {
            Username = seedUsername,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(seedPassword),
            FullName = builder.Configuration["AdminSeed:FullName"]?.Trim() ?? string.Empty,
            Email = builder.Configuration["AdminSeed:Email"]?.Trim() ?? string.Empty,
            ContactNumber = builder.Configuration["AdminSeed:ContactNumber"]?.Trim() ?? string.Empty,
            Designation = builder.Configuration["AdminSeed:Designation"]?.Trim() ?? string.Empty,
            Address = builder.Configuration["AdminSeed:Address"]?.Trim() ?? string.Empty,
            IsActive = true,
            SeedPasswordApplied = true,
            CreatedAt = DateTime.UtcNow,
        };
        await store.SaveAdminAsync(seededAdmin);
    }
    else
    {
        var adminChanged = false;
        if (!seededAdmin.SeedPasswordApplied)
        {
            seededAdmin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(seedPassword);
            seededAdmin.SeedPasswordApplied = true;
            adminChanged = true;
        }
        adminChanged |= SetIfEmpty(seededAdmin.FullName, value => seededAdmin.FullName = value, "AdminSeed:FullName");
        adminChanged |= SetIfEmpty(seededAdmin.Email, value => seededAdmin.Email = value, "AdminSeed:Email");
        adminChanged |= SetIfEmpty(seededAdmin.ContactNumber, value => seededAdmin.ContactNumber = value, "AdminSeed:ContactNumber");
        adminChanged |= SetIfEmpty(seededAdmin.Designation, value => seededAdmin.Designation = value, "AdminSeed:Designation");
        adminChanged |= SetIfEmpty(seededAdmin.Address, value => seededAdmin.Address = value, "AdminSeed:Address");
        if (seededAdmin.CreatedAt == default)
        {
            seededAdmin.CreatedAt = DateTime.UtcNow;
            adminChanged = true;
        }
        if (adminChanged)
        {
            await store.SaveAdminAsync(seededAdmin);
        }
    }

    bool SetIfEmpty(string currentValue, Action<string> assign, string configurationKey)
    {
        if (!string.IsNullOrWhiteSpace(currentValue))
        {
            return false;
        }
        assign(builder.Configuration[configurationKey]?.Trim() ?? string.Empty);
        return true;
    }
}

// ---- Middleware pipeline ----

app.UseExceptionHandler(errApp =>
{
    errApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"message\":\"An unexpected error occurred.\"}");
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseCors("AngularDev");

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = context =>
    {
        var path = context.Context.Request.Path;
        if (path.Equals("/index.html") || path.StartsWithSegments("/assets/config"))
        {
            context.Context.Response.Headers.CacheControl = "no-cache, no-store";
        }
        else if (path.StartsWithSegments("/uploads"))
        {
            context.Context.Response.Headers.CacheControl = "public,max-age=3600";
        }
        else
        {
            context.Context.Response.Headers.CacheControl = "public,max-age=31536000,immutable";
        }
    },
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");
app.MapFallback(async context =>
{
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    var indexPath = Path.Combine(app.Environment.WebRootPath, "index.html");
    if (!File.Exists(indexPath))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    context.Response.ContentType = "text/html; charset=utf-8";
    context.Response.Headers.CacheControl = "no-cache, no-store";
    await context.Response.SendFileAsync(indexPath);
});

app.Run();

static bool AddMissingContent(JsonObject target, JsonObject defaults)
{
    var changed = false;
    foreach (var property in defaults)
    {
        if (!target.ContainsKey(property.Key))
        {
            target[property.Key] = property.Value?.DeepClone();
            changed = true;
            continue;
        }

        if (target[property.Key] is JsonObject targetObject && property.Value is JsonObject defaultObject)
        {
            changed |= AddMissingContent(targetObject, defaultObject);
        }
    }
    return changed;
}

static bool ReplaceLegacyApplicationName(JsonNode node)
{
    var changed = false;
    if (node is JsonObject jsonObject)
    {
        foreach (var property in jsonObject.ToList())
        {
            if (property.Value is JsonValue value && value.TryGetValue<string>(out var text))
            {
                string updatedText;
                if (text.Contains("New New Satna Road Lines Lines", StringComparison.Ordinal))
                {
                    updatedText = text.Replace(
                        "New New Satna Road Lines Lines",
                        "New Satna Road Lines",
                        StringComparison.Ordinal);
                }
                else if (text.Contains("New Satna Road Lines", StringComparison.Ordinal))
                {
                    continue;
                }
                else if (text.Contains("Satna Road Industrial Logistics", StringComparison.Ordinal))
                {
                    updatedText = text.Replace(
                        "Satna Road Industrial Logistics",
                        "New Satna Road Lines",
                        StringComparison.Ordinal);
                }
                else if (text.Contains("Santa Road Industrial Logistics", StringComparison.Ordinal))
                {
                    updatedText = text.Replace(
                        "Santa Road Industrial Logistics",
                        "New Satna Road Lines",
                        StringComparison.Ordinal);
                }
                else if (text.Contains("Santa Road", StringComparison.Ordinal))
                {
                    updatedText = text.Replace("Santa Road", "New Satna Road Lines", StringComparison.Ordinal);
                }
                else
                {
                    updatedText = text.Replace("Satna Road", "New Satna Road Lines", StringComparison.Ordinal);
                }
                if (!string.Equals(text, updatedText, StringComparison.Ordinal))
                {
                    jsonObject[property.Key] = updatedText;
                    changed = true;
                }
            }
            else if (property.Value is not null)
            {
                changed |= ReplaceLegacyApplicationName(property.Value);
            }
        }
    }
    else if (node is JsonArray jsonArray)
    {
        foreach (var item in jsonArray)
        {
            if (item is not null)
            {
                changed |= ReplaceLegacyApplicationName(item);
            }
        }
    }
    return changed;
}
