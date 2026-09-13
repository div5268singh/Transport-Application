using SantaRoad.Api.Extensions;
using SantaRoad.Api.Startup;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplicationServices()
    .AddApiDocumentation(builder.Configuration)
    .AddPersistence(builder.Configuration)
    .AddJwtAuthentication(builder.Configuration)
    .AddCorsPolicy(builder.Configuration, builder.Environment);

var app = builder.Build();

await app.InitializeDatabaseAsync();

app.UseApiPipeline();
app.MapApiEndpoints();

app.Run();
