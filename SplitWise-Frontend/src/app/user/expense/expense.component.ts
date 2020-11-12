import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Expenses, UsersClient, PayersClient, PayeesClient, ExpensesClient, GroupMemberAC, GroupMemberClient, GroupsAC, GroupsClient, Payees, Payers, PayersAC, UserFriendClient, UsersAC } from 'src/app/shared/data.service';
import { GroupsComponent } from '../groups/groups.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  currentUserId: string = localStorage.getItem("userId");
  currentUserName: string = localStorage.getItem("userFullName");
  currentUser: UsersAC;
  expense: Expenses = new Expenses();
  expenseData: any = {
    Id: 0,
    GroupId: 0,
    Group: null,
    PayerId: null,
    User: null,
    Description: null,
    DateTime: null,
    Currency: null,
    Total: 0,
    SplitBy: null
  }

  payer: Payers = new Payers();
  payerData: any = {
    Id: 0,
    ExpenseId: 0,
    Expense: null,
    PayerId: null,
    User: null,
    AmountPaid: 0,
    PayerShare: 0,
    PayerInitialShare:0
  }

  payee: Payees = new Payees();
  payeeData: any = {
    Id: 0,
    GroupId: 0,
    Group: null,
    PayeeId: null,
    User: null,
    PayeeShare: 0,
    PayeeInitialShare:0
  }

  friends: UsersAC[] = [];
  groups: GroupsAC[] = [];
  groupmembers: GroupMemberAC[] = [];
  paidBy: any[] = [];
  expenseBetween: any[] = [];
  isIndividual: boolean;
  selectedUsers: UsersAC[] = [];
  postedExpenseId: any;
  selectedFriend: UsersAC;
  flag: boolean;
  selectedFriendShare: number = 0;
  myShare: number = 0;
  finalMyShare: number = 0;
  finalFriendShare: number = 0;
  shareOfPayee: number[] = [];
  percentageShare: number[] = [];


  constructor(private userFriendClient: UserFriendClient, private groupClient: GroupsClient,
    private groupMemberClient: GroupMemberClient, private userClient: UsersClient,
    private payerClient: PayersClient, private payeeClient: PayeesClient, private expenseClient: ExpensesClient, private route: Router) { }

  ngOnInit(): void {
    this.expenseData.PayerId = this.currentUserId;
    this.expenseData.Currency = "INR";
    this.getUser(this.currentUserId);
    this.getFriends(this.currentUserId);
    this.getGroups(this.currentUserId);
  }

  getUser(id: string) {
    this.userClient.getUser(id).subscribe(result => {
      this.currentUser = result;
      console.log(this.currentUser);
    },
      error => console.error());
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

  loadPaid() {
    if (this.expenseData.GroupId !== undefined && this.expenseData.GroupId > 0) {
      this.groupMemberClient.getGroupMember(this.expenseData.GroupId).subscribe(result => {
        this.groupmembers = result;
        console.log(this.groupmembers);
        this.paidBy = this.groupmembers.filter(k => k.user.id !== this.currentUserId);
        this.expenseBetween = this.groupmembers.filter(k => k.user.id !== this.currentUserId);
        this.isIndividual = false;
      },
        error => console.error(error));
    }
    else {
      this.paidBy = this.friends;
      this.expenseBetween = this.friends;
      this.isIndividual = true;
    }
  }

  addUser(id: string) {
    console.log(id);
    this.flag = true;
    this.selectedFriend = this.friends.find(k => k.id === id);
    // console.log(JSON.stringify(this.selectedFriend));
    this.paidBy = [];
    this.paidBy.push(this.selectedFriend);
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

  onSplit() { }

  add() {
    //console.log(this.expenseData);
    this.expense.init(this.expenseData);
    console.log(this.expense);
    this.expenseClient.postExpenses(this.expense).subscribe(result => {
      console.log(result);
      this.postedExpenseId = result.id;
      console.log(this.postedExpenseId);
      if (this.isIndividual == true) {
        if (result.splitBy == "Equally") {
          let userShare = result.total / 2;
          console.log(userShare);
          this.postPayer(userShare);
          if (this.selectedFriend.id != this.payerData.PayerId) {
            this.postPayees(userShare, this.selectedFriend.id);
          }
          else {
            this.postPayees(userShare, this.currentUserId);
          }
        }
        else if (result.splitBy == "By Percentage") {
          this.finalMyShare = result.total * (this.myShare / 100);
          console.log(this.finalMyShare);
          this.finalFriendShare = result.total * (this.selectedFriendShare / 100);
          console.log(this.finalFriendShare);
          if (this.selectedFriend.id == this.payerData.PayerId) {
            this.postPayer(this.finalFriendShare);
            this.postPayees(this.finalMyShare, this.currentUserId);
          }
          else {
            this.postPayer(this.finalMyShare);
            this.postPayees(this.finalFriendShare, this.selectedFriend.id);
          }
        }
        else if (result.splitBy == "Unequally") {
          if (this.selectedFriend.id == this.payerData.PayerId) {
            this.postPayer(this.selectedFriendShare);
            this.postPayees(this.myShare, this.currentUserId);
          }
          else {
            this.postPayer(this.myShare);
            this.postPayees(this.selectedFriendShare, this.selectedFriend.id);
          }
        }
      }
      else {
        if (result.splitBy == "Equally") {
          let length = this.selectedUsers.length;
          console.log(length);
          let userShare = result.total / length;
          console.log(userShare);
          this.postPayer(userShare);
          for (var i = 0; i < this.selectedUsers.length; i++) {
            if (this.selectedUsers[i].id != this.payerData.PayerId) {
              this.postPayees(userShare, this.selectedUsers[i].id);
            }
          }
        }
        else if (result.splitBy == "By Percentage") {
          this.percentageShare = [];
          for (const x of this.selectedUsers) {
            this.percentageShare[x.id] = result.total * (this.shareOfPayee[x.id] / 100);
            console.log(this.percentageShare);
          }
          let payShare = this.percentageShare[this.payerData.PayerId];
          console.log(payShare);
          this.postPayer(payShare);
          for (var i = 0; i < this.selectedUsers.length; i++) {
            if (this.selectedUsers[i].id != this.payerData.PayerId) {
              let payeeshare = this.percentageShare[this.selectedUsers[i].id];
              console.log(payeeshare);
              this.postPayees(payeeshare, this.selectedUsers[i].id);
            }
          }
        }
        else if(result.splitBy=="Unequally"){
          let payShare = this.shareOfPayee[this.payerData.PayerId];
          console.log(payShare);
          this.postPayer(payShare);
          for (var i = 0; i < this.selectedUsers.length; i++) {
            if (this.selectedUsers[i].id != this.payerData.PayerId) {
              let payeeshare = this.shareOfPayee[this.selectedUsers[i].id];
              console.log(payeeshare);
              this.postPayees(payeeshare, this.selectedUsers[i].id);
            }
          }
        }
      }
    },
      error => console.error(error));
  }

  postPayer(payerShare: number) {
    this.payerData.AmountPaid = this.expenseData.Total;
    this.payerData.ExpenseId = this.postedExpenseId;
    this.payerData.PayerShare = payerShare;
    this.payerData.PayerInitialShare=payerShare;
    this.payer.init(this.payerData);
    console.log(this.payer);
    this.payerClient.postPayers(this.payer).subscribe(result => {
      console.log(result);
    },
      error => console.error(error));
  }

  postPayees(payeeShare: number, id: string) {
    this.payeeData.PayeeId = id;
    this.payeeData.ExpenseId = this.postedExpenseId;
    this.payeeData.PayeeShare = payeeShare;
    this.payeeData.PayeeInitialShare=payeeShare;
    this.payee.init(this.payeeData);
    console.log(this.payee);
    this.payeeClient.postPayees(this.payee).subscribe(result => {
      console.log(result);
    },
      error => console.error(error));
  }
}
