namespace SantaRoad.Api.Models;

public class PartyDetail
{
    public int Id { get; set; }
    public PartyRole Role { get; set; } // informational only now; ownership is via Consignment.SenderId/ReceiverId
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPerson1Name { get; set; } = string.Empty;
    public string ContactPerson1Phone { get; set; } = string.Empty;
    public string ContactPerson2Name { get; set; } = string.Empty;
    public string ContactPerson2Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}
