import { Component, OnInit } from '@angular/core';
import { PayeesAC, PayersAC, PayersClient,PayeesClient } from 'src/app/shared/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userId: string = localStorage.getItem("userId");
  payerDetails: PayersAC[];
  payeeDetails: PayeesAC[];
  balance: number = 0;
  totalLent: number = 0;
  totalAmountPaid: number = 0;
  totalOwed: number = 0;
  totalShare: number;

  constructor(private payerClient: PayersClient, private payeeClient: PayeesClient) { }

  ngOnInit(): void {
    this.getData();
  }
  
  getData(){
    this.payerClient.getExpensesByPayerId(this.userId).subscribe(result => {
      this.payerDetails = result;
      var totalPaid = 0;
      var totalShare = 0;
      for (let i = 0; i < this.payerDetails.length; i++) {
        totalPaid = totalPaid + Number(this.payerDetails[i].amountPaid);
        totalShare = totalShare + Number(this.payerDetails[i].payerShare);
      }
      this.totalShare = totalShare;
      this.totalAmountPaid = totalPaid;
      this.totalLent = this.totalAmountPaid-this.totalShare;
    },
    error=>console.error(error));
    this.payeeClient.getExpensesByPayeeId(this.userId).subscribe(result=>{
      this.payeeDetails = result;
      var totalOwed = 0;
      for(let j=0;j<this.payeeDetails.length;j++){
        totalOwed = totalOwed + Number(this.payeeDetails[j].payeeShare);
      }
      this.totalOwed = this.totalOwed + totalOwed;
    },
    error=>console.error(error));
  }
  }

