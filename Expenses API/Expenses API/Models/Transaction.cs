using Expenses_API.Models.Base;

namespace Expenses_API.Models
{
    public class Transaction :BaseEntity
    {
        public string Type { get; set; } // "Expense" or "Income"
        public double Amount { get; set; }
        public string Category { get; set; } // e.g., "Food", "Salary", etc.

        public int? UserId { get; set; } // Foreign key to the User entity, nullable to allow transactions without an associated user (if needed)
        public virtual User? User { get; set; } // Navigation property to the User entity, virtual for lazy loading (if enabled in EF Core) see https://chatgpt.com/share/69c416e9-e818-8327-9553-12e2e07b9138

    }
}
