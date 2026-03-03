import { Component } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent {
  
  transactions: Transaction[] = [
    {
      id:1,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: 'Food',
      type: 'Expenses',
      amount: 50
    },
    {
      id:2,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: 'Food',
      type: 'Expenses',
      amount: 100
    }
  ];
}
