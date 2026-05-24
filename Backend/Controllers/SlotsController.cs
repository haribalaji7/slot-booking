using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlotsController : ControllerBase
{
    private readonly SlotService _svc;

    public SlotsController(SlotService svc) => _svc = svc;

    [HttpGet("offer/{offerId}")]
    public async Task<IActionResult> GetByOfferId(Guid offerId)
    {
        return Ok(await _svc.GetByOfferIdAsync(offerId));
    }

    [HttpGet("offer/{offerId}/available")]
    public async Task<IActionResult> GetAvailable(Guid offerId)
    {
        return Ok(await _svc.GetAvailableByOfferIdAsync(offerId));
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> CreateSlots([FromBody] CreateSlotsRequest request)
    {
        var slots = await _svc.CreateSlotsAsync(request);
        return Ok(slots);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (await _svc.DeleteSlotAsync(id)) return NoContent();
        return NotFound();
    }
}
