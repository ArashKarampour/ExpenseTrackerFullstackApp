using Expenses_API.Dtos;
using Expenses_API.Models;
using Microsoft.EntityFrameworkCore;

namespace Expenses_API.Data.Services
{

    public interface ITransactionService
    {
        List<Transaction> GetAll(int userId);
        Task<Transaction?> GetById(int id);
        Transaction Add(PostTransactionDto payload, int userId);
        Transaction? Update(int id,PutTransactionDto payload);
        void Delete(int id);
    }
    public class TransactionsService(AppDbContext context) : ITransactionService
    {
        public Transaction Add(PostTransactionDto payload, int userId)
        {
            var transaction = new Transaction()
            {
                Type = payload.Type,
                Amount = payload.Amount,
                Category = payload.Category,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = userId
            };

            context.Transactions.Add(transaction);
            context.SaveChanges();
            return transaction;
        }

        public void Delete(int id)
        {
            var transaction = context.Transactions.FirstOrDefault(t => t.Id == id);
            if (transaction != null)
            {
                context.Transactions.Remove(transaction);
                context.SaveChanges();
            }
        }

        public List<Transaction> GetAll(int userId)
        {
            var transactions = context.Transactions.Where(n => n.UserId == userId).ToList();
            return transactions;
        }

        public async Task<Transaction?> GetById(int id)
        {
            var transaction = await context.Transactions.FirstOrDefaultAsync(t => t.Id == id);
            return transaction;

        }

        public Transaction? Update(int id, PutTransactionDto payload)
        {
            var transaction = context.Transactions.FirstOrDefault(t => t.Id == id);
            if (transaction != null)
            {
                transaction.Type = payload.Type;
                transaction.Amount = payload.Amount;
                transaction.Category = payload.Category;
                transaction.UpdatedAt = DateTime.UtcNow;

                context.Transactions.Update(transaction);
                context.SaveChanges();
            }           

            return transaction;
        }
    }
}
