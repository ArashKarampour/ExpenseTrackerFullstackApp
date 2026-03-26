using Expenses_API.Data.Services;
using Expenses_API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace Expenses_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAngularDev")] // this is optional
    [Authorize] // this will require authentication for all endpoints in this controller. You can also apply it to specific actions if needed or using role based authentication.
    public class TransactionController (ITransactionService transactionService) : ControllerBase
    {// Dependency Injection of AppDbContext through constructor or primary constructor syntax

        [HttpGet("All")]
        public IActionResult GetAllTransactions()
        {
            var nameIdentifierClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // getting the user id based on the jwt that was generated with the claims in AuthContorller. The User property is available in the controller because of the [Authorize] attribute, which ensures that the request is authenticated and the user information is populated.
            if (nameIdentifierClaim.IsNullOrEmpty())
                return BadRequest("User ID claim is missing in the token.");

            if (!int.TryParse(nameIdentifierClaim, out int userId))
                return BadRequest("Invalid User ID claim in the token.");

            var transactions = transactionService.GetAll(userId);
            return Ok(transactions);
        }

        [HttpGet("Details/{id}")]
        public async Task<IActionResult> GetTransaction(int id)
        {
           
            var transaction = await transactionService.GetById(id);
            if (transaction == null)
                return NotFound();

            return Ok(transaction);
            
        }

        //[HttpGet("Details")]
        //public async Task<IActionResult> GetTransactionByQueryParam(int id)// This method demonstrates how to retrieve a transaction using a query parameter instead of a route parameter
        //{

        //    var transaction = await context.Transactions.FirstOrDefaultAsync(t => t.Id == id);
        //    if (transaction == null)
        //        return NotFound();

        //    return Ok(transaction);

        //}

        [HttpPost("Create")]
        public IActionResult CreateTransaction ([FromBody] PostTransactionDto payload)
        {
            var nameIdentifierClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // getting the user id based on the jwt that was generated with the claims in AuthContorller. The User property is available in the controller because of the [Authorize] attribute, which ensures that the request is authenticated and the user information is populated.
            if(nameIdentifierClaim.IsNullOrEmpty())
                return BadRequest("User ID claim is missing in the token.");

            if(!int.TryParse(nameIdentifierClaim, out int userId))
                return BadRequest("Invalid User ID claim in the token.");

            var transaction = transactionService.Add(payload, userId);

            // returning 201 Created with the location of the newly created transaction and the transaction data in the response body
            return CreatedAtAction(nameof(GetTransaction),   // actionName
                                   new { id = transaction.Id }, // routeValues
                                   transaction); // value;
            //actionName → The name of the GET action that retrieves the resource
            //routeValues → Usually the new entity's Id
            //value → The created resource to return in the body
        }

        [HttpPut("Update/{id}")]
        public IActionResult UpdateTransaction(int id, [FromBody] PutTransactionDto payload)
        {
            var transaction = transactionService.Update(id, payload);
            if(transaction == null)
                return NotFound();

            return Ok(transaction);
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult DeleteTransaction(int id)
        {
            transactionService.Delete(id);
            return NoContent(); // 204 No Content is a common response for successful deletions
        }
    }
}
