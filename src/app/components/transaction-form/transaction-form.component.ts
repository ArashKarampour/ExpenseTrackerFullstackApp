import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent implements OnInit {
  
  transactionsForm: FormGroup;
  incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift'];
  expenseCategories = ['Food', 'Transport', 'Entertainment', 'Bills'];
  
  availableCategories: string[] = [];
  
  constructor(private fb: FormBuilder, private router : Router) {
    this.transactionsForm = this.fb.group({
      type: ['Expense', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      // createdAt: [new Date(), Validators.required] 
    });
  }
  
  ngOnInit():void{
    this.updateAvailableCategories();
  }
  
  onSubmit() {
    throw new Error('Method not implemented.');
  }

  cancle() {
    this.router.navigate(['/transactions']);
  }

  updateAvailableCategories() {
    const type = this.transactionsForm.get('type')?.value;
    this.availableCategories = type === 'Expense' ? this.expenseCategories : this.incomeCategories;
    this.transactionsForm.patchValue({category: ''});
  }
  onTypeChange(event: any) {
    // event.target.value === 'Expense' ? this.availableCategories = this.expenseCategories : this.availableCategories = this.incomeCategories;
    // this.transactionsForm.patchValue({category: ''});
    this.updateAvailableCategories();
  }
}
