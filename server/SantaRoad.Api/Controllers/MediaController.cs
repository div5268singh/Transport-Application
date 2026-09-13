using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SantaRoad.Api.Dtos;
using SantaRoad.Api.Services;

namespace SantaRoad.Api.Controllers;

/// <summary>
/// Images and videos live on this server. They are addressed by an opaque id
/// with no file name, extension or storage path in the URL.
/// </summary>
[ApiController]
[Route("api/media")]
public class MediaController : ControllerBase
{
    private readonly MediaStorageService _media;

    public MediaController(MediaStorageService media)
    {
        _media = media;
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public IActionResult Get(string id)
    {
        var file = _media.FindById(id);
        if (file is null)
        {
            return NotFound();
        }

        // Range processing lets the browser seek within uploaded videos.
        return PhysicalFile(file.FullName, MediaStorageService.GetContentType(file.Name), enableRangeProcessing: true);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [RequestSizeLimit(50_000_000)]
    public async Task<ActionResult<MediaUploadResponse>> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "No file received." });
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_media.IsAllowedExtension(extension))
        {
            return BadRequest(new { message = $"File type {extension} is not allowed." });
        }

        await using var source = file.OpenReadStream();
        if (!await MediaStorageService.HasMatchingSignatureAsync(source, extension))
        {
            return BadRequest(new { message = "File content does not match its extension." });
        }

        var id = Guid.NewGuid().ToString("N");
        await using (var target = System.IO.File.Create(Path.Combine(_media.RootPath, id + extension)))
        {
            await source.CopyToAsync(target);
        }

        return Ok(new MediaUploadResponse(_media.BuildUrl(id), id));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public ActionResult<IEnumerable<MediaItemResponse>> List()
    {
        var items = new DirectoryInfo(_media.RootPath)
            .EnumerateFiles()
            .Where(file => _media.IsAllowedExtension(file.Extension))
            .OrderByDescending(file => file.LastWriteTimeUtc)
            .Select(file => new MediaItemResponse(
                _media.BuildUrl(Path.GetFileNameWithoutExtension(file.Name)),
                Path.GetFileNameWithoutExtension(file.Name),
                file.Length,
                MediaStorageService.GetContentType(file.Name),
                file.LastWriteTimeUtc));

        return Ok(items);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete(string id)
    {
        var file = _media.FindById(id);
        if (file is null)
        {
            return NotFound();
        }

        file.Delete();
        return NoContent();
    }
}
