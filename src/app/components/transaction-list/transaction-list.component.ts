import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService){}
  

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
}
