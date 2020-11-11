import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PayersAC,PayeesAC,ExpensesAC,PayeesClient,PayersClient, ExpensesClient, GroupMemberAC ,GroupMemberClient, GroupsClient, GroupsAC} from 'src/app/shared/data.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  currentUserId: string = localStorage.getItem("userId");
  constructor(private expenseClient:ExpensesClient,private activatedRoute:ActivatedRoute,
    private payerClient:PayersClient, private payeeClient:PayeesClient, private groupMemberClient:GroupMemberClient
    ,private groupClient:GroupsClient) { }
  
  expenses:ExpensesAC[]=[];
  payers : PayersAC[];
  allPayerExpenses: PayersAC[];
  allPayeeExpenses: PayeesAC[];
  usersBalance: any[] = [];
  usersOwes: any[] = [];
  payerforCalculation: PayersAC={
    id:0,
    expenseId:0,
    expense:null,
    amountPaid:0,
    payerShare:0,
    init:null,
    toJSON:null
  };
  payeeforCalculation:PayeesAC={
    id:0,
    expenseId:0,
    expense:null,
    payeeShare:0,
    payeeId:null,
    init:null,
    toJSON:null
  };

  payees : PayeesAC[];
  allPayers:PayersAC[]=[];
  allPayees:PayeesAC[]=[];
  groupmembers:GroupMemberAC[];
  groupId:number;
  showIds: number[] = [];
  groupdetails:GroupsAC;
  totalOwes: number=0;
  totalOwed: number=0;
  grandTotal: number=0;
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(e=>{
      this.groupId=+e.get('id');
      this.getgroupbyId(this.groupId);
      this.getExpensesbyGroupId(this.groupId);
      this.getMembersbyGroupId(this.groupId);
     });
  }

  getgroupbyId(id:number){
    this.groupClient.getGroupById(id).subscribe(result=>{
     this.groupdetails=result;
     console.log(this.groupdetails);
    },
    error=>console.error());
  }
  
  getExpensesbyGroupId(id:number){
    this.expenseClient.getExpensesByGroupId(id).subscribe(result=>{
      this.expenses=result;
      console.log(this.expenses);
      
    },
    error=>console.error());
  }
  
  getMembersbyGroupId(id:number){
    this.groupMemberClient.getGroupMember(id).subscribe(result=>{
      this.groupmembers=result;
      console.log(this.groupmembers);
      this.getGroupBalance();
    },
    error=>console.error());
  }
  
  
  
  getGroupBalance() {
    this.usersBalance=[];
    this.usersOwes=[];
    for (let j = 0; j < this.groupmembers.length; j++) {
      this.payerClient.getExpensesByPayerId(this.groupmembers[j].memberId).subscribe(result => {
        this.allPayerExpenses = result;
        console.log(this.allPayerExpenses);
        var totalPaid = 0;
        var totalOwed = 0;
        var balance = 0;
        var id = this.groupmembers[j].memberId;
        var name = this.groupmembers[j].user.name;
        for (let i = 0; i < this.allPayerExpenses.length; i++) {
          if(this.allPayerExpenses[i].expense.groupId == this.groupId){
            totalPaid = totalPaid + Number(this.allPayerExpenses[i].amountPaid);
            totalOwed = totalOwed + Number(this.allPayerExpenses[i].payerShare);
            id = this.allPayerExpenses[i].payerId;
            name = this.allPayerExpenses[i].user.name;
          }
        }
        balance = totalPaid - totalOwed;
        var userBalance = {
          id: id,
          balance: balance,
          userName: name
        }
        this.usersBalance.push(userBalance);
        console.log(this.usersBalance);
        
        this.payeeClient.getExpensesByPayeeId(this.groupmembers[j].memberId).subscribe(result => {
          this.allPayeeExpenses = result;
          console.log(this.allPayeeExpenses);
          var totalOwed = 0;
          var id = "";
          var name = "";
          for (let i = 0; i < this.allPayeeExpenses.length; i++) {
            if(this.allPayeeExpenses[i].expense.groupId == this.groupId){
              totalOwed = totalOwed + Number(this.allPayeeExpenses[i].payeeShare);
              id = this.allPayeeExpenses[i].payeeId;
              name = this.allPayeeExpenses[i].user.name;
            }
          }
          this.usersBalance[j].balance = this.usersBalance[j].balance - totalOwed; 
          var userOwes = {
            id: id,
            totalOwed: totalOwed,
            userName: name
          }
          this.usersOwes.push(userOwes);
          console.log(userOwes);
          console.log(this.usersBalance);
        },
          error => {
            console.error(error);
          });
      },
        error => {
          console.error(error);
        });
      
    }
  }

  showCard(id: number) {

    if (this.showIds.indexOf(id) != -1) {
      this.showIds.splice(this.showIds.indexOf(id), 1);
    }
    else {
      this.showIds.push(id);
    }
    this.payerClient.getPayersByExpenseId(id).subscribe(result => {
      this.payers=result;
    },
    error=>console.error(error));
    this.payeeClient.getPayeesByExpenseId(id).subscribe(result =>{
      this.payees=result;
    },
    error=>console.error(error));
  }
 
}
