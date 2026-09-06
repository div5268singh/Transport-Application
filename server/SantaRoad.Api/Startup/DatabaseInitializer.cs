using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using SantaRoad.Api.Data;
using SantaRoad.Api.Models;

namespace SantaRoad.Api.Startup;

public static class DatabaseInitializer
{
    /// <summary>Applies migrations, then seeds the admin user and default site content.</summary>
    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        await scope.ServiceProvider.GetRequiredService<SantaRoadDbContext>().Database.MigrateAsync();

        var store = scope.ServiceProvider.GetRequiredService<ISantaRoadStore>();
        await SeedSiteContentAsync(store, app.Configuration);
        await SeedAdminAsync(store, app.Configuration);
    }

    private static async Task SeedSiteContentAsync(ISantaRoadStore store, IConfiguration configuration)
    {
        var defaultsPath = Path.Combine(AppContext.BaseDirectory, "Seed", "app.config.json");
        if (!File.Exists(defaultsPath))
        {
            return;
        }

        var defaults = JsonNode.Parse(await File.ReadAllTextAsync(defaultsPath)) as JsonObject ?? [];
        var siteContent = await store.GetSiteContentAsync();

        if (siteContent is null)
        {
            await store.SaveSiteContentAsync(new SiteContent
            {
                JsonData = defaults.ToJsonString(),
                UpdatedAt = DateTime.UtcNow,
            });
            return;
        }

        var stored = JsonNode.Parse(siteContent.JsonData) as JsonObject ?? [];
        var changed = SiteContentMerger.AddMissingContent(stored, defaults);
        changed |= SiteContentMerger.ReplaceLegacyApplicationName(stored);

        if (!changed)
        {
            return;
        }

        siteContent.JsonData = stored.ToJsonString();
        siteContent.UpdatedAt = DateTime.UtcNow;
        await store.SaveSiteContentAsync(siteContent);
    }

    private static async Task SeedAdminAsync(ISantaRoadStore store, IConfiguration configuration)
    {
        var username = configuration["AdminSeed:Username"]?.Trim();
        var password = configuration["AdminSeed:Password"];

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            throw new InvalidOperationException("AdminSeed username and password must be configured.");
        }

        var admin = await store.GetAdminAsync(username);

        if (admin is null)
        {
            await store.SaveAdminAsync(new AdminUser
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                FullName = Setting(configuration, "FullName"),
                Email = Setting(configuration, "Email"),
                ContactNumber = Setting(configuration, "ContactNumber"),
                Designation = Setting(configuration, "Designation"),
                Address = Setting(configuration, "Address"),
                IsActive = true,
                SeedPasswordApplied = true,
                CreatedAt = DateTime.UtcNow,
            });
            return;
        }

        var changed = false;

        if (!admin.SeedPasswordApplied)
        {
            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            admin.SeedPasswordApplied = true;
            changed = true;
        }

        changed |= FillIfEmpty(admin.FullName, v => admin.FullName = v, configuration, "FullName");
        changed |= FillIfEmpty(admin.Email, v => admin.Email = v, configuration, "Email");
        changed |= FillIfEmpty(admin.ContactNumber, v => admin.ContactNumber = v, configuration, "ContactNumber");
        changed |= FillIfEmpty(admin.Designation, v => admin.Designation = v, configuration, "Designation");
        changed |= FillIfEmpty(admin.Address, v => admin.Address = v, configuration, "Address");

        if (admin.CreatedAt == default)
        {
            admin.CreatedAt = DateTime.UtcNow;
            changed = true;
        }

        if (changed)
        {
            await store.SaveAdminAsync(admin);
        }
    }

    private static string Setting(IConfiguration configuration, string key) =>
        configuration[$"AdminSeed:{key}"]?.Trim() ?? string.Empty;

    private static bool FillIfEmpty(string current, Action<string> assign, IConfiguration configuration, string key)
    {
        if (!string.IsNullOrWhiteSpace(current))
        {
            return false;
        }

        assign(Setting(configuration, key));
        return true;
    }
}
