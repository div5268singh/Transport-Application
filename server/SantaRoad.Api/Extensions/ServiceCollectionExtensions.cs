using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using SantaRoad.Api.Data;
using SantaRoad.Api.Services;

namespace SantaRoad.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public const string CorsPolicyName = "SantaRoadCors";

    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("SqlServer")?.Trim();
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("ConnectionStrings:SqlServer must be configured.");
        }

        services.AddDbContext<SantaRoadDbContext>(options =>
            options.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure()));
        services.AddScoped<ISantaRoadStore, EfCoreSantaRoadStore>();
        services.AddHealthChecks().AddDbContextCheck<SantaRoadDbContext>();

        return services;
    }

    /// <summary>Registers the OpenAPI document that both Scalar and Swagger UI render.</summary>
    public static IServiceCollection AddApiDocumentation(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer((document, _, _) =>
            {
                document.Info = new OpenApiInfo
                {
                    Title = $"{configuration["ApplicationName"] ?? "satnaLogistics"} API",
                    Version = "v1",
                    Description = "Consignment tracking, driver and site-content API.",
                };

                var bearer = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    Description = "Paste just the JWT token (no 'Bearer ' prefix).",
                };

                document.Components ??= new OpenApiComponents();
                document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
                document.Components.SecuritySchemes["Bearer"] = bearer;

                document.Security =
                [
                    new OpenApiSecurityRequirement
                    {
                        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
                    }
                ];

                return Task.CompletedTask;
            });
        });

        return services;
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtKey = configuration["Jwt:Key"];
        var jwtIssuer = configuration["Jwt:Issuer"];

        if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetByteCount(jwtKey) < 32)
        {
            throw new InvalidOperationException("Jwt:Key must be configured with at least 32 bytes.");
        }
        if (string.IsNullOrWhiteSpace(jwtIssuer))
        {
            throw new InvalidOperationException("Jwt:Issuer must be configured.");
        }

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtIssuer,
                    // Admin and driver tokens share this scheme; the distinction
                    // is enforced with [Authorize(Roles = ...)] per controller.
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1),
                };
            });

        services.AddAuthorization();
        return services;
    }

    public static IServiceCollection AddCorsPolicy(
        this IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        services.AddCors(options => options.AddPolicy(CorsPolicyName, policy =>
        {
            if (environment.IsDevelopment())
            {
                policy.SetIsOriginAllowed(origin =>
                    Uri.TryCreate(origin, UriKind.Absolute, out var uri)
                    && uri.Host is "localhost" or "127.0.0.1");
            }
            else
            {
                var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
                if (allowedOrigins.Length == 0)
                {
                    // The Angular site is deployed separately, so at least allow its own origin.
                    allowedOrigins = [configuration["Frontend:BaseUrl"] ?? string.Empty];
                }

                allowedOrigins = [.. allowedOrigins.Where(origin => !string.IsNullOrWhiteSpace(origin))];
                if (allowedOrigins.Length > 0)
                {
                    policy.WithOrigins(allowedOrigins);
                }
            }

            policy.AllowAnyHeader().AllowAnyMethod();
        }));

        return services;
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddResponseCompression(options => options.EnableForHttps = true);
        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.KnownIPNetworks.Clear();
            options.KnownProxies.Clear();
        });

        services.AddScoped<JwtTokenService>();
        services.AddScoped<CredentialGeneratorService>();
        services.AddSingleton<MediaStorageService>();

        return services;
    }
}
