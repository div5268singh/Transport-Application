using Scalar.AspNetCore;

namespace SantaRoad.Api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseApiPipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();
        app.UseResponseCompression();

        app.UseExceptionHandler(errApp => errApp.Run(async context =>
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync("{\"message\":\"An unexpected error occurred.\"}");
        }));

        if (!app.Environment.IsDevelopment())
        {
            app.UseHsts();
            app.UseHttpsRedirection();
        }

        app.UseCors(ServiceCollectionExtensions.CorsPolicyName);
        app.UseStaticContent();
        app.UseAuthentication();
        app.UseAuthorization();

        return app;
    }

    /// <summary>Serves wwwroot when present. Uploaded media is not static - it goes through MediaController.</summary>
    private static void UseStaticContent(this WebApplication app)
    {
        // The API is deployed without the Angular build, so wwwroot may not exist.
        if (!Directory.Exists(app.Environment.WebRootPath ?? string.Empty))
        {
            return;
        }

        app.UseDefaultFiles();
        app.UseStaticFiles(new StaticFileOptions
        {
            OnPrepareResponse = context =>
            {
                var path = context.Context.Request.Path;
                context.Context.Response.Headers.CacheControl =
                    path.Equals("/index.html") || path.StartsWithSegments("/assets/config")
                        ? "no-cache, no-store"
                        : "public,max-age=31536000,immutable";
            },
        });
    }

    public static WebApplication MapApiEndpoints(this WebApplication app)
    {
        app.MapControllers();
        app.MapHealthChecks("/health");
        app.MapApiDocumentation();
        app.MapSpaFallback();

        return app;
    }

    /// <summary>OpenAPI document plus both UIs, available in every environment.</summary>
    private static void MapApiDocumentation(this WebApplication app)
    {
        const string documentRoute = "/openapi/v1.json";

        app.MapOpenApi(documentRoute);

        app.MapScalarApiReference("/scalar", options =>
        {
            options.Title = "satnaLogistics API";
            options.OpenApiRoutePattern = documentRoute;
            options.HideModels = false;
        });

        app.UseSwaggerUI(options =>
        {
            options.RoutePrefix = "swagger";
            options.SwaggerEndpoint(documentRoute, "satnaLogistics API v1");
            options.DocumentTitle = "satnaLogistics API";
        });

        app.MapGet("/docs", () => Results.Redirect("/scalar")).ExcludeFromDescription();
    }

    private static void MapSpaFallback(this WebApplication app)
    {
        app.MapFallback(async context =>
        {
            var webRoot = app.Environment.WebRootPath;
            var indexPath = webRoot is null ? null : Path.Combine(webRoot, "index.html");

            if (context.Request.Path.StartsWithSegments("/api")
                || indexPath is null
                || !File.Exists(indexPath))
            {
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                return;
            }

            context.Response.ContentType = "text/html; charset=utf-8";
            context.Response.Headers.CacheControl = "no-cache, no-store";
            await context.Response.SendFileAsync(indexPath);
        });
    }
}
