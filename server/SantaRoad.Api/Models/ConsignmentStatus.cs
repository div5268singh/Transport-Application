namespace SantaRoad.Api.Models;

public enum ConsignmentStatus
{
    Created = 0,
    PickedUp = 1,
    InTransit = 2,
    Delivered = 3
}

public enum PartyRole
{
    Sender = 0,
    Receiver = 1
}
