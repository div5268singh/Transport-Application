using Google.Cloud.Firestore;

namespace SantaRoad.Api.Models;

[FirestoreData]
public class DriverAssignment
{
    public int Id { get; set; }
    public int ConsignmentId { get; set; }

    [FirestoreProperty]
    public string VehicleNumber { get; set; } = string.Empty;
    [FirestoreProperty]
    public string DriverName { get; set; } = string.Empty;
    [FirestoreProperty]
    public string DriverContactNo { get; set; } = string.Empty;
    [FirestoreProperty]
    public string SecondContactNo { get; set; } = string.Empty;
    [FirestoreProperty]
    public string OwnerContactNo { get; set; } = string.Empty;

    [FirestoreProperty]
    public string Username { get; set; } = string.Empty;
    [FirestoreProperty]
    public string PasswordHash { get; set; } = string.Empty;
    [FirestoreProperty]
    public bool CredentialsExpired { get; set; } = false;
}
