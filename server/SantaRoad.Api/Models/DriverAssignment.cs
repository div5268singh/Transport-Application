
namespace SantaRoad.Api.Models;

public class DriverAssignment
{
    public int Id { get; set; }
    public int ConsignmentId { get; set; }
    public string VehicleNumber { get; set; } = string.Empty;
    public string DriverName { get; set; } = string.Empty;
    public string DriverContactNo { get; set; } = string.Empty;
    public string SecondContactNo { get; set; } = string.Empty;
    public string OwnerContactNo { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool CredentialsExpired { get; set; } = false;
}
