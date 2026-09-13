using Microsoft.AspNetCore.StaticFiles;

namespace SantaRoad.Api.Services;

/// <summary>
/// Resolves where uploaded images/videos are stored on the API server and
/// maps opaque ids to files so no storage path is ever exposed to the browser.
/// </summary>
public class MediaStorageService
{
    public const string RequestPath = "/api/media";

    private static readonly FileExtensionContentTypeProvider ContentTypes = new();

    private static readonly Dictionary<string, byte[][]> Signatures = new(StringComparer.OrdinalIgnoreCase)
    {
        [".jpg"] = [[0xFF, 0xD8, 0xFF]],
        [".jpeg"] = [[0xFF, 0xD8, 0xFF]],
        [".png"] = [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
        [".gif"] = [[0x47, 0x49, 0x46, 0x38]],
        [".webp"] = [[0x52, 0x49, 0x46, 0x46]],
        [".mp4"] = [[0x66, 0x74, 0x79, 0x70]],
        [".webm"] = [[0x1A, 0x45, 0xDF, 0xA3]],
    };

    public MediaStorageService(IConfiguration configuration, IWebHostEnvironment env)
    {
        var configured = configuration["Media:RootPath"]?.Trim();

        // Support ASP.NET-style "~/" roots and resolve all relative paths
        // from the app content root so deployment folders behave predictably.
        RootPath = ResolveRootPath(configured, env.ContentRootPath);

        Directory.CreateDirectory(RootPath);
    }

    public string RootPath { get; }

    public IReadOnlyCollection<string> AllowedExtensions { get; } =
        [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm"];

    public string BuildUrl(string id) => $"{RequestPath}/{id}";

    public bool IsAllowedExtension(string extension) =>
        AllowedExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase);

    /// <summary>Rejects files whose bytes do not match their declared extension.</summary>
    public static async Task<bool> HasMatchingSignatureAsync(Stream stream, string extension)
    {
        if (!Signatures.TryGetValue(extension, out var candidates))
        {
            return false;
        }

        var offset = extension is ".mp4" ? 4 : 0;
        var buffer = new byte[offset + candidates.Max(c => c.Length)];
        var read = await stream.ReadAsync(buffer);
        stream.Position = 0;

        return candidates.Any(signature =>
            read >= offset + signature.Length
            && buffer.Skip(offset).Take(signature.Length).SequenceEqual(signature));
    }

    /// <summary>Finds the stored file for an opaque id, or null when the id is unknown or unsafe.</summary>
    public FileInfo? FindById(string id)
    {
        if (string.IsNullOrWhiteSpace(id)
            || !id.All(c => char.IsAsciiLetterOrDigit(c) || c is '-' or '_'))
        {
            return null;
        }

        return AllowedExtensions
            .Select(extension => new FileInfo(Path.Combine(RootPath, id + extension)))
            .FirstOrDefault(file => file.Exists);
    }

    public static string GetContentType(string fileName) =>
        ContentTypes.TryGetContentType(fileName, out var contentType)
            ? contentType
            : "application/octet-stream";

    private static string ResolveRootPath(string? configured, string contentRootPath)
    {
        if (string.IsNullOrWhiteSpace(configured))
        {
            return Path.GetFullPath(Path.Combine(contentRootPath, "App_Data", "media"));
        }

        if (configured.StartsWith("~/", StringComparison.Ordinal))
        {
            var relativeFromRoot = configured[2..]
                .Replace('/', Path.DirectorySeparatorChar)
                .Replace('\\', Path.DirectorySeparatorChar);
            return Path.GetFullPath(Path.Combine(contentRootPath, relativeFromRoot));
        }

        if (Path.IsPathRooted(configured))
        {
            return Path.GetFullPath(configured);
        }

        return Path.GetFullPath(Path.Combine(contentRootPath, configured));
    }
}
