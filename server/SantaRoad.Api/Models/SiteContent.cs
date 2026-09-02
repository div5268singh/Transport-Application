using Google.Cloud.Firestore;

namespace SantaRoad.Api.Models;

// Keeps the same "one JSON blob" shape the frontend already uses
// (public/assets/config/app.config.json), just persisted server-side
// instead of in localStorage. Admin edits go through ContentController.
[FirestoreData]
public class SiteContent
{
    [FirestoreProperty]
    public int Id { get; set; }
    [FirestoreProperty]
    public string JsonData { get; set; } = string.Empty;
    [FirestoreProperty]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
