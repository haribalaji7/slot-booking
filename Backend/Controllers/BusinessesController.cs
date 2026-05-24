using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BusinessesController : ControllerBase
{
    private readonly AppDbContext _db;

    public BusinessesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var businesses = await _db.Businesses.OrderBy(b => b.Name).ToListAsync();
        return Ok(businesses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var business = await _db.Businesses.FindAsync(id);
        if (business == null) return NotFound();
        return Ok(business);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Business business)
    {
        business.Id = Guid.NewGuid();
        _db.Businesses.Add(business);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = business.Id }, business);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Business updated)
    {
        var business = await _db.Businesses.FindAsync(id);
        if (business == null) return NotFound();

        business.Name = updated.Name;
        business.BusinessType = updated.BusinessType;
        business.OwnerName = updated.OwnerName;
        business.Phone = updated.Phone;
        business.Email = updated.Email;
        business.Address = updated.Address;
        business.City = updated.City;
        business.OpeningTime = updated.OpeningTime;
        business.ClosingTime = updated.ClosingTime;

        await _db.SaveChangesAsync();
        return Ok(business);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var business = await _db.Businesses.FindAsync(id);
        if (business == null) return NotFound();
        _db.Businesses.Remove(business);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
