using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SantaRoad.Api.Data;
using SantaRoad.Api.Dtos;

namespace SantaRoad.Api.Controllers;

[ApiController]
[Route("api/tracking")]
[AllowAnonymous]
public class TrackingController : ControllerBase
{
    private readonly ISantaRoadStore _store;

    public TrackingController(ISantaRoadStore store)
    {
        _store = store;
    }

    [HttpGet("{consignmentNumber}")]
    public async Task<ActionResult<PublicTrackingDto>> Get(string consignmentNumber)
    {
        var c = await _store.GetConsignmentByNumberAsync(consignmentNumber);

        if (c is null) return NotFound(new { message = "No consignment found with that number." });

        var dto = new PublicTrackingDto(
            c.ConsignmentNumber,
            c.Status,
            c.Sender.CompanyName,
            c.Receiver.CompanyName,
            c.DriverAssignment.VehicleNumber,
            c.DriverAssignment.DriverName,
            c.TrackingUpdates
                .OrderBy(t => t.UpdatedAt)
                .Select(t => new TrackingUpdateDto(t.CityName, t.AreaName, t.UpdatedAt))
                .ToList()
        );

        return Ok(dto);
    }
}
