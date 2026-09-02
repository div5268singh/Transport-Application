using Google.Cloud.Firestore;

namespace SantaRoad.Api.Models;

[FirestoreData]
public class AdminUser
{
    [FirestoreProperty]
    public int Id { get; set; }
    [FirestoreProperty]
    public string Username { get; set; } = string.Empty;
    [FirestoreProperty]
    public string PasswordHash { get; set; } = string.Empty;
    [FirestoreProperty]
    public string FullName { get; set; } = string.Empty;
    [FirestoreProperty]
    public string Email { get; set; } = string.Empty;
    [FirestoreProperty]
    public string ContactNumber { get; set; } = string.Empty;
    [FirestoreProperty]
    public string Designation { get; set; } = string.Empty;
    [FirestoreProperty]
    public string Address { get; set; } = string.Empty;
    [FirestoreProperty]
    public bool IsActive { get; set; } = true;
    [FirestoreProperty]
    public bool SeedPasswordApplied { get; set; }
    [FirestoreProperty]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
