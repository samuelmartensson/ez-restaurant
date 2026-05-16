using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

public class CommonQueryParameters
{
    private string _key = string.Empty;

    [FromQuery, Required]
    required public string Key
    {
        get => _key;
        set => _key = value.ToLowerInvariant();
    }

    [FromQuery, Required]
    required public string Language { get; set; }
}
