using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OffersController : ControllerBase
{
    private readonly OfferService _svc;

    public OffersController(OfferService svc) => _svc = svc;

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? category,
        [FromQuery] string? status,
        [FromQuery] string? businessType,
        [FromQuery] DateOnly? date,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool? availableOnly)
    {
        return Ok(await _svc.GetAllAsync(category, status, businessType, date, minPrice, maxPrice, availableOnly));
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var offer = await _svc.GetByIdAsync(id);
        if (offer == null) return NotFound();
        return Ok(offer);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOfferRequest request)
    {
        var offer = await _svc.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = offer.Id }, offer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOfferRequest request)
    {
        var offer = await _svc.UpdateAsync(id, request);
        if (offer == null) return NotFound();
        return Ok(offer);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (await _svc.DeleteAsync(id)) return NoContent();
        return NotFound();
    }
}
