using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

public class CommonQueryParameters
{
    [FromQuery, Required]
    required public string Key { get; set; }

    [FromQuery, Required]
    required public string Language { get; set; }
}
