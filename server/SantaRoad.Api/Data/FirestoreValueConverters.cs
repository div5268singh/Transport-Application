using System.Globalization;
using Google.Cloud.Firestore;
using SantaRoad.Api.Models;

namespace SantaRoad.Api.Data;

public sealed class DecimalFirestoreConverter : IFirestoreConverter<decimal>
{
    public object ToFirestore(decimal value) => value.ToString(CultureInfo.InvariantCulture);

    public decimal FromFirestore(object value) => value switch
    {
        string text => decimal.Parse(text, CultureInfo.InvariantCulture),
        long number => number,
        double number => Convert.ToDecimal(number),
        _ => throw new ArgumentException($"Cannot convert {value.GetType()} to decimal.")
    };
}

public sealed class ConsignmentStatusFirestoreConverter : IFirestoreConverter<ConsignmentStatus>
{
    public object ToFirestore(ConsignmentStatus value) => value.ToString();

    public ConsignmentStatus FromFirestore(object value) =>
        Enum.Parse<ConsignmentStatus>((string)value, ignoreCase: true);
}

public sealed class PartyRoleFirestoreConverter : IFirestoreConverter<PartyRole>
{
    public object ToFirestore(PartyRole value) => value.ToString();

    public PartyRole FromFirestore(object value) =>
        Enum.Parse<PartyRole>((string)value, ignoreCase: true);
}
