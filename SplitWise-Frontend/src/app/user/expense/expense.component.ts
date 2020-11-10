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
    PayerShare: 0
  }

  payee: Payees = new Payees();
  payeeData: any = {
    Id: 0,
    GroupId: 0,
    Group: null,
    PayeeId: null,
    User: null,
    PayeeShare: 0
  }

  friends: UsersAC[] = [];
  groups: GroupsAC[] = [];
  groupmembers: GroupMemberAC[] = [];
  paidBy: GroupMemberAC[] = [];
  expenseBetween: GroupMemberAC[] = [];
  isIndividual: boolean;
  selectedUsers: UsersAC[] = [];
  postedExpenseId: any;

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
    this.groupMemberClient.getGroupMember(this.expenseData.GroupId).subscribe(result => {
      this.groupmembers = result;
      console.log(this.groupmembers);
      this.paidBy = this.groupmembers.filter(k => k.user.id !== this.currentUserId);
      this.expenseBetween = this.groupmembers.filter(k => k.user.id !== this.currentUserId);
      this.isIndividual = false;
    },
      error => console.error(error));
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
    },
      error => console.error(error));
  }

  postPayer(payerShare: number) {
    this.payerData.AmountPaid = this.expenseData.Total;
    this.payerData.ExpenseId = this.postedExpenseId;
    this.payerData.PayerShare = payerShare;
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
    this.payee.init(this.payeeData);
    console.log(this.payee);
    this.payeeClient.postPayees(this.payee).subscribe(result => {
      console.log(result);
    },
      error => console.error(error));
  }
}
