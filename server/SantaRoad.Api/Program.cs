using SantaRoad.Api.Extensions;
using SantaRoad.Api.Startup;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplicationServices()
    .AddApiDocumentation(builder.Configuration)
    .AddPersistence(builder.Configuration)
    .AddJwtAuthentication(builder.Configuration)
    .AddCorsPolicy(builder.Configuration, builder.Environment)
    .AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()); // only if you send cookies; omit if using bearer tokens only
});

var app = builder.Build();

await app.InitializeDatabaseAsync();

app.UseApiPipeline();
app.MapApiEndpoints();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.Run();
