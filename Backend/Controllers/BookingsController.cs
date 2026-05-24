using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly BookingService _svc;

    public BookingsController(BookingService svc) => _svc = svc;

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest request)
    {
        try
        {
            var booking = await _svc.CreateAsync(request);
            return CreatedAtAction(nameof(GetByReference), new { reference = booking?.BookingReference }, booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [AllowAnonymous]
    [HttpGet("reference/{reference}")]
    public async Task<IActionResult> GetByReference(string reference)
    {
        var booking = await _svc.GetByReferenceAsync(reference);
        if (booking == null) return NotFound();
        return Ok(booking);
    }

    [HttpGet("offer/{offerId}")]
    public async Task<IActionResult> GetByOfferId(Guid offerId)
    {
        return Ok(await _svc.GetByOfferIdAsync(offerId));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _svc.GetAllAsync());
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] string status)
    {
        var booking = await _svc.UpdateStatusAsync(id, status);
        if (booking == null) return NotFound();
        return Ok(booking);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        return Ok(await _svc.GetDashboardAsync());
    }
}
