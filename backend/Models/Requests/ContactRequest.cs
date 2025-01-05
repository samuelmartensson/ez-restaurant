namespace Models.Requests
{
    public class ContactRequest
    {
        required public string Name { get; set; }
        required public string Email { get; set; }
        required public string Description { get; set; }
    };
}
