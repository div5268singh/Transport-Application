using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SantaRoad.Api.Data;
using SantaRoad.Api.Dtos;
using SantaRoad.Api.Models;

namespace SantaRoad.Api.Controllers;

[ApiController]
[Route("api/content")]
public class ContentController : ControllerBase
{
    private readonly ISantaRoadStore _store;

    public ContentController(ISantaRoadStore store)
    {
        _store = store;
    }

    // Public: the marketing site reads current content on every page load.
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<SiteContentResponse>> Get()
    {
        var row = await _store.GetSiteContentAsync();
        if (row is null)
        {
            // Nothing saved to the DB yet — fall back to the bundled
            // default JSON that ships in public/assets/config/app.config.json
            // so the site still renders on a fresh database.
            var defaultsPath = Path.Combine(
                AppContext.BaseDirectory,
                "wwwroot",
                "assets",
                "config",
                "app.config.json");
            var json = System.IO.File.Exists(defaultsPath)
                ? await System.IO.File.ReadAllTextAsync(defaultsPath)
                : "{}";
            return Ok(new SiteContentResponse(json, DateTime.UtcNow));
        }

        return Ok(new SiteContentResponse(row.JsonData, row.UpdatedAt));
    }

    // Admin only: overwrite the whole content JSON blob.
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SiteContentResponse>> Update(UpdateSiteContentRequest request)
    {
        var row = await _store.GetSiteContentAsync();
        if (row is null)
        {
            row = new SiteContent();
        }

        row.JsonData = request.JsonData;
        row.UpdatedAt = DateTime.UtcNow;
        await _store.SaveSiteContentAsync(row);

        return Ok(new SiteContentResponse(row.JsonData, row.UpdatedAt));
    }
}
