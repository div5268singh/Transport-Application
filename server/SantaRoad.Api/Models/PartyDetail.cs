using Google.Cloud.Firestore;
using SantaRoad.Api.Data;

namespace SantaRoad.Api.Models;

[FirestoreData]
public class PartyDetail
{
    public int Id { get; set; }
    [FirestoreProperty(ConverterType = typeof(PartyRoleFirestoreConverter))]
    public PartyRole Role { get; set; } // informational only now; ownership is via Consignment.SenderId/ReceiverId

    [FirestoreProperty]
    public string CompanyName { get; set; } = string.Empty;
    [FirestoreProperty]
    public string ContactPerson1Name { get; set; } = string.Empty;
    [FirestoreProperty]
    public string ContactPerson1Phone { get; set; } = string.Empty;
    [FirestoreProperty]
    public string ContactPerson2Name { get; set; } = string.Empty;
    [FirestoreProperty]
    public string ContactPerson2Phone { get; set; } = string.Empty;
    [FirestoreProperty]
    public string Email { get; set; } = string.Empty;
    [FirestoreProperty]
    public string Address { get; set; } = string.Empty;
}
