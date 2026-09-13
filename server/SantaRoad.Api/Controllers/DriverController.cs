using System.Security.Claims;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SantaRoad.Api.Data;
using SantaRoad.Api.Dtos;
using SantaRoad.Api.Models;
using SantaRoad.Api.Services;

namespace SantaRoad.Api.Controllers;

[ApiController]
[Route("api/driver")]
public class DriverController : ControllerBase
{
    private readonly ISantaRoadStore _store;
    private readonly JwtTokenService _jwt;

    public DriverController(ISantaRoadStore store, JwtTokenService jwt)
    {
        _store = store;
        _jwt = jwt;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<DriverLoginResponse>> Login(DriverLoginRequest request)
    {
        var consignment = await _store.GetConsignmentByDriverUsernameAsync(request.Username);
        var assignment = consignment?.DriverAssignment;

        if (assignment is null || !BCrypt.Net.BCrypt.Verify(request.Password, assignment.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        if (IsDriverAccessExpired(consignment))
        {
            return StatusCode(403, new { message = "Driver access expired after delivery completion." });
        }

        if (consignment is null) return Unauthorized(new { message = "Invalid username or password." });
        var (token, expiresAt) = _jwt.IssueDriverToken(consignment.Id, consignment.ConsignmentNumber, assignment.Username);

        return Ok(new DriverLoginResponse(token, expiresAt, consignment.ConsignmentNumber));
    }

    [HttpGet("consignment")]
    [Authorize(Roles = "Driver")]
    public async Task<ActionResult<DriverConsignmentDto>> GetMyConsignment()
    {
        var consignmentId = GetConsignmentIdFromToken();

        var c = await _store.GetConsignmentByIdAsync(consignmentId);

        if (c is null) return NotFound();

        if (IsDriverAccessExpired(c))
        {
            return StatusCode(403, new { message = "Driver access expired after delivery completion." });
        }

        // Deliberately built without touching c.Billing at all — billing
        // must never be reachable from the driver's token, even if a
        // future edit to this controller reintroduces the reference.
        var dto = new DriverConsignmentDto(
            c.ConsignmentNumber,
            c.Status,
            new PartyDto(c.Sender.CompanyName, c.Sender.ContactPerson1Name, c.Sender.ContactPerson1Phone,
                c.Sender.ContactPerson2Name, c.Sender.ContactPerson2Phone, c.Sender.Email, c.Sender.Address),
            new PartyDto(c.Receiver.CompanyName, c.Receiver.ContactPerson1Name, c.Receiver.ContactPerson1Phone,
                c.Receiver.ContactPerson2Name, c.Receiver.ContactPerson2Phone, c.Receiver.Email, c.Receiver.Address),
            new DriverDetailsDto(c.DriverAssignment.VehicleNumber, c.DriverAssignment.DriverName,
                c.DriverAssignment.DriverContactNo, c.DriverAssignment.SecondContactNo, c.DriverAssignment.OwnerContactNo,
                c.DriverAssignment.DriverEmail)
        );

        return Ok(dto);
    }

    [HttpPost("location")]
    [Authorize(Roles = "Driver")]
    public async Task<IActionResult> PostLocation(DriverLocationRequest request)
    {
        var consignmentId = GetConsignmentIdFromToken();

        var consignment = await _store.GetConsignmentByIdAsync(consignmentId);
        if (consignment is null) return NotFound();
        var assignment = consignment.DriverAssignment;

        if (IsDriverAccessExpired(consignment))
        {
            return StatusCode(403, new { message = "Driver access expired after delivery completion." });
        }

        // Driver can only post city/state after pickup starts.
        if (consignment.Status == ConsignmentStatus.Created)
        {
            return BadRequest(new { message = "Location updates are allowed only after consignment is picked up." });
        }

        consignment.TrackingUpdates.Add(new TrackingUpdate
        {
            ConsignmentId = consignmentId,
            CityName = request.CityName,
            AreaName = request.StateName,
            UpdatedAt = DateTime.UtcNow,
        });

        await _store.SaveConsignmentAsync(consignment);
        return NoContent();
    }

    private int GetConsignmentIdFromToken()
    {
        var claim = User.FindFirst("consignmentId")?.Value;
        return int.Parse(claim ?? "0");
    }

    private static bool IsDriverAccessExpired(Consignment? consignment)
    {
        if (consignment is null)
        {
            return true;
        }

        if (consignment.DriverAssignment.CredentialsExpired)
        {
            return true;
        }

        if (consignment.Status != ConsignmentStatus.Delivered || consignment.DeliveredAt is null)
        {
            return false;
        }

        var expiresAt = consignment.DeliveredAt.Value.Date.AddDays(1);
        return DateTime.UtcNow >= expiresAt;
    }
}
