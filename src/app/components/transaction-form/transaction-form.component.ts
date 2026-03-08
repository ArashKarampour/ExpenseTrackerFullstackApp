import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

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

  editMode = false;
  transactionId? : number;
  
  constructor(private fb: FormBuilder, 
    private router : Router, 
    private transactionService: TransactionService,
    private activatedRoute: ActivatedRoute) {
    this.transactionsForm = this.fb.group({
      type: ['Expense', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      // createdAt: [new Date(), Validators.required] 
    });
  }
  
  ngOnInit():void{    
    this.updateAvailableCategories();
    const id = this.activatedRoute.snapshot.paramMap.get('id'); // Get the transaction ID from the route parameters
    if(id){
      this.editMode = true;
      this.transactionId = id as unknown as number;
      this.loadTransaction(this.transactionId)
    }
  }

  loadTransaction(transactionId: number) {
    this.transactionService.getById(transactionId).subscribe({
      next: (transaction) => {
        this.updateAvailableCategories(transaction.type);

        this.transactionsForm.patchValue({
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,          
        });
      },
      error: (err) => {
        console.error('Error loading transaction', err);
      }
    })
  }
  
  onSubmit() {
    if(this.transactionsForm.valid){
      this.editMode ? this.transactionService.update(this.transactionId as number, this.transactionsForm.value).subscribe((data) => {
        console.log('Transaction updated successfully', data);
        this.router.navigate(['/transactions']);
      }) : this.transactionService.create(this.transactionsForm.value).subscribe((data) => {
        console.log('Transaction created successfully', data);
        this.router.navigate(['/transactions']);
      });
    }
  }

  cancle() {
    this.router.navigate(['/transactions']);
  }

  updateAvailableCategories(transactionType?: string) {
    const type = transactionType ?? this.transactionsForm.get('type')?.value;
    this.availableCategories = type === 'Expense' ? this.expenseCategories : this.incomeCategories;
    this.transactionsForm.patchValue({category: ''});
  }
  onTypeChange(event: any) {
    // event.target.value === 'Expense' ? this.availableCategories = this.expenseCategories : this.availableCategories = this.incomeCategories;
    // this.transactionsForm.patchValue({category: ''});    
    this.updateAvailableCategories();
  }
}
