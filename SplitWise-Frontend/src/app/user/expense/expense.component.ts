import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Expenses,UsersClient, GroupMemberAC, GroupMemberClient, GroupsAC, GroupsClient, Payees, Payers, PayersAC, UserFriendClient, UsersAC } from 'src/app/shared/data.service';
import { GroupsComponent } from '../groups/groups.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  currentUserId: string = localStorage.getItem("userId");
  currentUserName: string = localStorage.getItem("userFullName");
  currentUser:UsersAC;
  expense:Expenses=new Expenses();
  expenseData:any={
    Id:0,
    GroupId:0,
    Group:null,
    PayerId:null,
    User:null,
    Description:null,
    DateTime:null,
    Currency:null,
    Total:0,
    SplitBy:null
  }

  payer:Payers=new Payers();
  payerData:any={
    Id:0,
    ExpenseId:0,
    Expense:null,
    PayerId:null,
    User:null,
    AmountPaid:0,
    PayerShare:0
  }

  payee:Payees=new Payees();
  payeeData:any={
    Id:0,
    GroupId:0,
    Group:null,
    PayeeId:null,
    User:null,
    PayeeShare:0
  }
  
  friends:UsersAC[]=[];
  groups:GroupsAC[]=[];
  groupmembers:GroupMemberAC[]=[];
  paidBy:GroupMemberAC[]=[];
  expenseBetween:GroupMemberAC[]=[];
  isIndividual: boolean;
  selectedUsers:UsersAC[]=[];
  
  constructor(private userFriendClient:UserFriendClient, private groupClient:GroupsClient,
    private groupMemberClient:GroupMemberClient, private userClient:UsersClient,private route:Router) { }

  ngOnInit(): void {
    this.expenseData.PayerId=this.currentUserId;
    this.expenseData.Currency="INR";
    this.getUser(this.currentUserId);
    this.getFriends(this.currentUserId);
    this.getGroups(this.currentUserId);
  }

  getUser(id:string){
    this.userClient.getUser(id).subscribe(result=>{
      this.currentUser=result;
      console.log(this.currentUser);
    },
    error=>console.error());
  }
  
  getFriends(id:string){
    this.userFriendClient.getAllFriends(id).subscribe(result=>{
      this.friends=result;
      console.log(this.friends);
    },
    error=>console.error());
  }

  getGroups(id:string){
    this.groupClient.getGroupsByUserId(id).subscribe(result=>{
      this.groups=result;
      console.log(this.groups);
    },
    error=>console.error(error));
  }

  loadPaid(){
    this.groupMemberClient.getGroupMember(this.expenseData.GroupId).subscribe(result=>{
      this.groupmembers=result;
      console.log(this.groupmembers);
      this.paidBy = this.groupmembers.filter(k => k.user.id !== this.currentUserId);
      this.expenseBetween = this.groupmembers.filter(k => k.user.id !== this.currentUserId);
      this.isIndividual=false;
    },
    error=>console.error(error));
  }

  onCheck(checked: boolean, id: string) {
    // console.log(checked + '|' + id);
    if (checked === true) {
      if (id === this.currentUserId) {
        this.selectedUsers.push(this.currentUser);
      } else {
        this.selectedUsers.push(this.friends.find(k => k.id === id));
      }
    } else {
      // delete
      const x = this.selectedUsers.find(k => k.id === id);
      this.selectedUsers = this.selectedUsers.filter(k => k !== x);
    }
    console.log(this.selectedUsers);
    this.onSplit();
  }

  onSplit(){

  }
}
