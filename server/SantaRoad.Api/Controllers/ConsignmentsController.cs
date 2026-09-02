using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SantaRoad.Api.Data;
using SantaRoad.Api.Dtos;
using SantaRoad.Api.Models;
using SantaRoad.Api.Services;

namespace SantaRoad.Api.Controllers;

[ApiController]
[Route("api/consignments")]
[Authorize(Roles = "Admin")]
public class ConsignmentsController : ControllerBase
{
    private readonly ISantaRoadStore _store;
    private readonly CredentialGeneratorService _credentials;
    private readonly IConfiguration _config;

    public ConsignmentsController(ISantaRoadStore store, CredentialGeneratorService credentials, IConfiguration config)
    {
        _store = store;
        _credentials = credentials;
        _config = config;
    }

    [HttpPost]
    public async Task<ActionResult<CreateConsignmentResponse>> Create(CreateConsignmentRequest request)
    {
        var sender = new PartyDetail
        {
            Role = PartyRole.Sender,
            CompanyName = request.Sender.CompanyName,
            ContactPerson1Name = request.Sender.ContactPerson1Name,
            ContactPerson1Phone = request.Sender.ContactPerson1Phone,
            ContactPerson2Name = request.Sender.ContactPerson2Name,
            ContactPerson2Phone = request.Sender.ContactPerson2Phone,
            Email = request.Sender.Email,
            Address = request.Sender.Address,
        };
        var receiver = new PartyDetail
        {
            Role = PartyRole.Receiver,
            CompanyName = request.Receiver.CompanyName,
            ContactPerson1Name = request.Receiver.ContactPerson1Name,
            ContactPerson1Phone = request.Receiver.ContactPerson1Phone,
            ContactPerson2Name = request.Receiver.ContactPerson2Name,
            ContactPerson2Phone = request.Receiver.ContactPerson2Phone,
            Email = request.Receiver.Email,
            Address = request.Receiver.Address,
        };

        var plaintextPassword = _credentials.GeneratePassword();
        var driverUsername = _credentials.GenerateDriverUsername(request.Driver.DriverName);

        var driverAssignment = new DriverAssignment
        {
            VehicleNumber = request.Driver.VehicleNumber,
            DriverName = request.Driver.DriverName,
            DriverContactNo = request.Driver.DriverContactNo,
            SecondContactNo = request.Driver.SecondContactNo,
            OwnerContactNo = request.Driver.OwnerContactNo,
            Username = driverUsername,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(plaintextPassword),
            CredentialsExpired = false,
        };

        var billing = new BillingDetail
        {
            OrderPrice = request.Billing.OrderPrice,
            ReceivedAmount = request.Billing.ReceivedAmount,
            BalancePaymentMode = request.Billing.BalancePaymentMode,
            BalancePaymentNotes = request.Billing.BalancePaymentNotes,
        };

        var consignmentNumber = await GenerateUniqueConsignmentNumber();

        var consignment = new Consignment
        {
            ConsignmentNumber = consignmentNumber,
            Status = ConsignmentStatus.Created,
            Sender = sender,
            Receiver = receiver,
            Billing = billing,
            DriverAssignment = driverAssignment,
        };

        await _store.CreateConsignmentAsync(consignment);

        var frontendBase = _config["Frontend:BaseUrl"] ?? "http://localhost:4200";
        var trackingLink = $"{frontendBase}/track/{consignment.ConsignmentNumber}";

        return Ok(new CreateConsignmentResponse(
            consignment.Id,
            consignment.ConsignmentNumber,
            trackingLink,
            driverUsername,
            plaintextPassword
        ));
    }

    [HttpGet]
    public async Task<ActionResult<List<ConsignmentSummaryDto>>> List([FromQuery] ConsignmentStatus? status)
    {
        var consignments = await _store.ListConsignmentsAsync(status);
        var results = consignments
            .Select(c => new ConsignmentSummaryDto(
                c.Id,
                c.ConsignmentNumber,
                c.Status,
                c.Sender.CompanyName,
                c.Receiver.CompanyName,
                c.CreatedAt
            ))
            .ToList();

        return Ok(results);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ConsignmentDetailDto>> Detail(int id)
    {
        var c = await _store.GetConsignmentByIdAsync(id);

        if (c is null) return NotFound();

        return Ok(MapToDetail(c));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ConsignmentDetailDto>> Update(int id, CreateConsignmentRequest request)
    {
        var c = await _store.GetConsignmentByIdAsync(id);

        if (c is null) return NotFound();

        c.Sender.CompanyName = request.Sender.CompanyName;
        c.Sender.ContactPerson1Name = request.Sender.ContactPerson1Name;
        c.Sender.ContactPerson1Phone = request.Sender.ContactPerson1Phone;
        c.Sender.ContactPerson2Name = request.Sender.ContactPerson2Name;
        c.Sender.ContactPerson2Phone = request.Sender.ContactPerson2Phone;
        c.Sender.Email = request.Sender.Email;
        c.Sender.Address = request.Sender.Address;

        c.Receiver.CompanyName = request.Receiver.CompanyName;
        c.Receiver.ContactPerson1Name = request.Receiver.ContactPerson1Name;
        c.Receiver.ContactPerson1Phone = request.Receiver.ContactPerson1Phone;
        c.Receiver.ContactPerson2Name = request.Receiver.ContactPerson2Name;
        c.Receiver.ContactPerson2Phone = request.Receiver.ContactPerson2Phone;
        c.Receiver.Email = request.Receiver.Email;
        c.Receiver.Address = request.Receiver.Address;

        c.Billing.OrderPrice = request.Billing.OrderPrice;
        c.Billing.ReceivedAmount = request.Billing.ReceivedAmount;
        c.Billing.BalancePaymentMode = request.Billing.BalancePaymentMode;
        c.Billing.BalancePaymentNotes = request.Billing.BalancePaymentNotes;

        // Driver identity fields are editable; username/password are NOT
        // regenerated here — use a dedicated endpoint if you need to reset
        // driver credentials, so a routine edit never silently locks out
        // a driver who's already mid-delivery.
        c.DriverAssignment.VehicleNumber = request.Driver.VehicleNumber;
        c.DriverAssignment.DriverName = request.Driver.DriverName;
        c.DriverAssignment.DriverContactNo = request.Driver.DriverContactNo;
        c.DriverAssignment.SecondContactNo = request.Driver.SecondContactNo;
        c.DriverAssignment.OwnerContactNo = request.Driver.OwnerContactNo;

        await _store.SaveConsignmentAsync(c);
        return Ok(MapToDetail(c));
    }

    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateStatusRequest request)
    {
        var c = await _store.GetConsignmentByIdAsync(id);

        if (c is null) return NotFound();

        c.Status = request.Status;
        if (request.Status == ConsignmentStatus.Delivered)
        {
            c.DeliveredAt = DateTime.UtcNow;
            c.DriverAssignment.CredentialsExpired = true;
        }

        await _store.SaveConsignmentAsync(c);
        return NoContent();
    }

    private async Task<string> GenerateUniqueConsignmentNumber()
    {
        string number;
        do
        {
            number = _credentials.GenerateConsignmentNumber();
        } while (await _store.ConsignmentNumberExistsAsync(number));

        return number;
    }

    private static ConsignmentDetailDto MapToDetail(Consignment c) => new(
        c.Id,
        c.ConsignmentNumber,
        c.Status,
        c.CreatedAt,
        c.DeliveredAt,
        new PartyDto(c.Sender.CompanyName, c.Sender.ContactPerson1Name, c.Sender.ContactPerson1Phone,
            c.Sender.ContactPerson2Name, c.Sender.ContactPerson2Phone, c.Sender.Email, c.Sender.Address),
        new PartyDto(c.Receiver.CompanyName, c.Receiver.ContactPerson1Name, c.Receiver.ContactPerson1Phone,
            c.Receiver.ContactPerson2Name, c.Receiver.ContactPerson2Phone, c.Receiver.Email, c.Receiver.Address),
        new BillingDto(c.Billing.OrderPrice, c.Billing.ReceivedAmount, c.Billing.BalancePaymentMode, c.Billing.BalancePaymentNotes),
        new DriverDetailsDto(c.DriverAssignment.VehicleNumber, c.DriverAssignment.DriverName,
            c.DriverAssignment.DriverContactNo, c.DriverAssignment.SecondContactNo, c.DriverAssignment.OwnerContactNo),
        c.TrackingUpdates
            .OrderBy(t => t.UpdatedAt)
            .Select(t => new TrackingUpdateDto(t.CityName, t.AreaName, t.UpdatedAt))
            .ToList()
    );
}
