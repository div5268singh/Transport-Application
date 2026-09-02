using Google.Cloud.Firestore;

namespace SantaRoad.Api.Models;

[FirestoreData]
public class TrackingUpdate
{
    public int Id { get; set; }
    public int ConsignmentId { get; set; }
    [FirestoreProperty]
    public string CityName { get; set; } = string.Empty;
    [FirestoreProperty]
    public string AreaName { get; set; } = string.Empty;
    [FirestoreProperty]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
