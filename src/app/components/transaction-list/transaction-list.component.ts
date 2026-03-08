import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService, private router: Router){}
  

  ngOnInit(): void{
    this.loadTransactions();
  }

  loadTransactions(): void{
    this.transactionService.getAll()
    .subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: (err) => {
        console.log(`Error while getting all transactions ${err}`);
      },
    });
  }

  getTotalExpense(): number{
    return this.transactions.filter(t => t.type == 'Expense').reduce((sum, expense) => sum + expense.amount, 0);
  }

  getTotalIncome(): number{
    return this.transactions.filter(t => t.type == 'Income').reduce((sum, income) => sum + income.amount, 0);
  }

  getTotalBalance(): number{
    return this.getTotalIncome() - this.getTotalExpense();
  }

  editTransaction(transaction: Transaction) {
    if(transaction.id){
      this.router.navigate(["/edit/",transaction.id]);
    }
  }
}
