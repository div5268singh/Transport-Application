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
    private readonly IWebHostEnvironment _env;

    public ContentController(ISantaRoadStore store, IWebHostEnvironment env)
    {
        _store = store;
        _env = env;
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

    // Admin only: real file upload, replacing the old base64-in-localStorage
    // StorageSimulator. Saves under wwwroot/uploads and returns a URL the
    // frontend can drop straight into app.config.json banner/service/video
    // fields.
    [HttpPost("media")]
    [Authorize(Roles = "Admin")]
    [RequestSizeLimit(50_000_000)]
    public async Task<ActionResult<MediaUploadResponse>> UploadMedia(IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "No file received." });
        }

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
        {
            return BadRequest(new { message = $"File type {ext} is not allowed." });
        }

        var uploadsRoot = Path.Combine(_env.WebRootPath ?? _env.ContentRootPath, "uploads");
        Directory.CreateDirectory(uploadsRoot);

        var safeName = $"{Guid.NewGuid():N}{ext}";
        var fullPath = Path.Combine(uploadsRoot, safeName);

        await using (var stream = System.IO.File.Create(fullPath))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new MediaUploadResponse($"/uploads/{safeName}", safeName));
    }
}
