import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpensesAC,UsersAC, GroupsAC,SettlementsAC,Settlements,UserFriendClient,GroupsClient, SettlementsClient, ExpensesClient } from 'src/app/shared/data.service';

@Component({
  selector: 'app-settlements',
  templateUrl: './settlements.component.html',
  styleUrls: ['./settlements.component.css']
})
export class SettlementsComponent implements OnInit {
  currentUserId: string = localStorage.getItem("userId");
  currentUserName: string = localStorage.getItem("userFullName");
  friends: UsersAC[] = [];
  groups: GroupsAC[] = [];
  groupExpenses:ExpensesAC[]=[];
  settlement:Settlements=new Settlements();
  settlementData:any={
    Id:0,
    GroupId:0,
    PayerId:null,
    Payer:null,
    PayeeId:null,
    Payee:null,
    DateTime:null,
    Amount:0,
    ExpenseId:0
  }
  constructor(private userFriendClient: UserFriendClient, private groupClient: GroupsClient,
    private expenseClient:ExpensesClient, private settlementClient:SettlementsClient, private router:Router) { }

  ngOnInit(): void {
    this.getFriends(this.currentUserId);
    this.getGroups(this.currentUserId);
  }
  
  getFriends(id: string) {
    this.userFriendClient.getAllFriends(id).subscribe(result => {
      this.friends = result;
      console.log(this.friends);
    },
      error => console.error());
  }

  getGroups(id: string) {
    this.groupClient.getGroupsByUserId(id).subscribe(result => {
      this.groups = result;
      console.log(this.groups);
    },
      error => console.error(error));
  }

  loadExpense(){
    
        this.expenseClient.getExpensesByGroupId(this.settlementData.GroupId).subscribe(result => {
          this.groupExpenses = result;
          console.log(this.groupExpenses);
          },
          error => console.error(error));
     
    
  }

  add(){
    console.log(this.settlementData);
    this.settlement.init(this.settlementData);
    console.log(this.settlement);
    this.settlementClient.postSettlements(this.settlement).subscribe(result => {
      console.log(result);
      this.router.navigateByUrl(`/start-up/home/dashboard`)
          .then(() => {
            window.location.reload();
          });
    },
      error => console.error(error));
  }
}
