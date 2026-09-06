
namespace SantaRoad.Api.Models;

// Keeps the same "one JSON blob" shape the frontend already uses
// (public/assets/config/app.config.json), just persisted server-side
// instead of in localStorage. Admin edits go through ContentController.
public class SiteContent
{
    public int Id { get; set; }
    public string JsonData { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
