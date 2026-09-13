using System.ComponentModel.DataAnnotations;

namespace SantaRoad.Api.Dtos;

public record AdminLoginRequest(
	[property: Required, StringLength(120, MinimumLength = 2)] string Username,
	[property: Required, StringLength(200, MinimumLength = 4)] string Password);
public record AdminLoginResponse(
	string Token,
	DateTime ExpiresAt,
	string Username,
	string FullName,
	string Email,
	string ContactNumber,
	string Designation);
public record AdminSessionResponse(
	bool Authenticated,
	string Username,
	string FullName,
	string Email,
	string ContactNumber,
	string Designation);

public record DriverLoginRequest(
	[property: Required, StringLength(120, MinimumLength = 2)] string Username,
	[property: Required, StringLength(200, MinimumLength = 4)] string Password);
public record DriverLoginResponse(string Token, DateTime ExpiresAt, string ConsignmentNumber);
