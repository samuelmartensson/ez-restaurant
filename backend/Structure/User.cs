
namespace Database.Models
{

    public class User
    {
        required public int CustomerId { get; set; }

        required public string Id { get; set; }
        public Customer? Customer { get; set; }

    }

}
