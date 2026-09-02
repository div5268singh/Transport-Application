namespace SantaRoad.Api.Dtos;

public record AdminLoginRequest(string Username, string Password);
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

public record DriverLoginRequest(string Username, string Password);
public record DriverLoginResponse(string Token, DateTime ExpiresAt, string ConsignmentNumber);
