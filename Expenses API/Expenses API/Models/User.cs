using Expenses_API.Models.Base;

namespace Expenses_API.Models
{
    public class User :BaseEntity
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public List<Transaction> Transactions { get; set; } // Navigation property for the one-to-many relationship with Transaction

    }
}

// see this for details on relationships for Entity Framework Core: https://learn.microsoft.com/en-us/ef/core/modeling/relationships?tabs=data-annotations%2Cwithout-nrt%2Cwith-nrt and https://chatgpt.com/share/69c41129-b8c0-8325-9251-5528375b8f7b
