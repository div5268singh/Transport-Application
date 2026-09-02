using Google.Cloud.Firestore;
using SantaRoad.Api.Models;

namespace SantaRoad.Api.Data;

public sealed class FirestoreSantaRoadStore : ISantaRoadStore
{
    private const string ConsignmentsCollection = "consignments";
    private readonly FirestoreDb _db;

    public FirestoreSantaRoadStore(FirestoreDb db) => _db = db;

    public async Task<AdminUser?> GetAdminAsync(string username)
    {
        var snapshot = await _db.Collection("admins").Document(username).GetSnapshotAsync();
        return snapshot.Exists ? snapshot.ConvertTo<AdminUser>() : null;
    }

    public Task SaveAdminAsync(AdminUser admin) =>
        _db.Collection("admins").Document(admin.Username).SetAsync(admin);

    public async Task<bool> ConsignmentNumberExistsAsync(string consignmentNumber)
    {
        var snapshot = await _db.Collection(ConsignmentsCollection)
            .WhereEqualTo(nameof(Consignment.ConsignmentNumber), consignmentNumber)
            .Limit(1)
            .GetSnapshotAsync();
        return snapshot.Count > 0;
    }

    public async Task<Consignment> CreateConsignmentAsync(Consignment consignment)
    {
        var counterReference = _db.Collection("metadata").Document("counters");
        consignment.Id = await _db.RunTransactionAsync(async transaction =>
        {
            var counterSnapshot = await transaction.GetSnapshotAsync(counterReference);
            var nextId = counterSnapshot.Exists && counterSnapshot.TryGetValue<long>("consignments", out var current)
                ? checked((int)current + 1)
                : 1;

            consignment.DriverAssignment.ConsignmentId = nextId;
            foreach (var update in consignment.TrackingUpdates)
            {
                update.ConsignmentId = nextId;
            }

            transaction.Set(counterReference, new Dictionary<string, object> { ["consignments"] = nextId }, SetOptions.MergeAll);
            transaction.Create(_db.Collection(ConsignmentsCollection).Document(nextId.ToString()), consignment);
            return nextId;
        });

        return consignment;
    }

    public async Task<IReadOnlyList<Consignment>> ListConsignmentsAsync(ConsignmentStatus? status = null)
    {
        var snapshot = await _db.Collection(ConsignmentsCollection).GetSnapshotAsync();
        return snapshot.Documents
            .Select(document => document.ConvertTo<Consignment>())
            .Where(consignment => status is null || consignment.Status == status)
            .OrderByDescending(consignment => consignment.CreatedAt)
            .ToList();
    }

    public async Task<Consignment?> GetConsignmentByIdAsync(int id)
    {
        var snapshot = await _db.Collection(ConsignmentsCollection).Document(id.ToString()).GetSnapshotAsync();
        return snapshot.Exists ? snapshot.ConvertTo<Consignment>() : null;
    }

    public Task<Consignment?> GetConsignmentByNumberAsync(string consignmentNumber) =>
        GetOneAsync(_db.Collection(ConsignmentsCollection)
            .WhereEqualTo(nameof(Consignment.ConsignmentNumber), consignmentNumber));

    public Task<Consignment?> GetConsignmentByDriverUsernameAsync(string username) =>
        GetOneAsync(_db.Collection(ConsignmentsCollection)
            .WhereEqualTo($"{nameof(Consignment.DriverAssignment)}.{nameof(DriverAssignment.Username)}", username));

    public Task SaveConsignmentAsync(Consignment consignment) =>
        _db.Collection(ConsignmentsCollection).Document(consignment.Id.ToString()).SetAsync(consignment);

    public async Task<SiteContent?> GetSiteContentAsync()
    {
        var snapshot = await _db.Collection("siteContent").Document("current").GetSnapshotAsync();
        return snapshot.Exists ? snapshot.ConvertTo<SiteContent>() : null;
    }

    public Task SaveSiteContentAsync(SiteContent content) =>
        _db.Collection("siteContent").Document("current").SetAsync(content);

    private static async Task<Consignment?> GetOneAsync(Query query)
    {
        var snapshot = await query.Limit(1).GetSnapshotAsync();
        return snapshot.Documents.Count == 0 ? null : snapshot.Documents[0].ConvertTo<Consignment>();
    }
}
