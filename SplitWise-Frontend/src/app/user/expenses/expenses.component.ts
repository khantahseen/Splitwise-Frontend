import { Component, OnInit } from '@angular/core';
import { PayeesAC, PayeesClient, PayersAC, PayersClient } from 'src/app/shared/data.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  currentUserId: string = localStorage.getItem("userId");
  myPayerList: PayersAC[]=[];
  myPayeeList: PayeesAC[]=[];
  constructor(private payerClient: PayersClient, private payeeClient: PayeesClient) { }

  ngOnInit(): void {
    this.getMyExpenses();
  }
  
  getMyExpenses(){
    this.payerClient.getExpensesByPayerId(this.currentUserId).subscribe(result => {
      console.log(result);
      this.myPayerList = result;
    },
      error => console.error(error));
    this.payeeClient.getExpensesByPayeeId(this.currentUserId).subscribe(result => {
      this.myPayeeList = result;
    },
      error => console.error(error));
  }
}
