using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("customer")]

public class Customer
{
    [Key]
    public int Id { get; set; }
    public string Subscription { get; set; }

    [Column("contact_name")]
    public string ContactName { get; set; }

    [Column("contact_email")]
    public string ContactEmail { get; set; }

    [Column("register_date")]
    public string RegisterDate { get; set; }

    //for simpler syntax when parsing from SQL reader. skipping .tostring ?? "" everywhere in code
    public Customer(object id, object subscription, object contactName, object contactEmail, object registerDate)
    {
        Id = Convert.ToInt32(id);
        Subscription = subscription.ToString() ?? "";
        ContactName = contactName.ToString() ?? "";
        ContactEmail = contactEmail.ToString() ?? "";
        RegisterDate = registerDate.ToString() ?? "";
    }
    public Customer(int id, string subscription, string contactName, string contactEmail, string registerDate)
    {
        Id = id;
        Subscription = subscription.ToString();
        ContactName = contactName.ToString();
        ContactEmail = contactEmail.ToString();
        RegisterDate = registerDate.ToString();
    }



}