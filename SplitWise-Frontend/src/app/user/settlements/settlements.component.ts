import { Component, OnInit } from '@angular/core';
import { UsersAC, GroupsAC,SettlementsAC,Settlements,UserFriendClient,GroupsClient, SettlementsClient } from 'src/app/shared/data.service';

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
  settlement:Settlements=new Settlements();
  settlementData:any={
    Id:0,
    GroupId:0,
    PayerId:null,
    Payer:null,
    PayeeId:null,
    Payee:null,
    DateTime:null,
    Amount:0
  }
  constructor(private userFriendClient: UserFriendClient, private groupClient: GroupsClient, private settlementClient:SettlementsClient) { }

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

  add(){
    console.log(this.settlementData);
    this.settlement.init(this.settlementData);
    console.log(this.settlement);
    this.settlementClient.postSettlements(this.settlement).subscribe(result => {
      console.log(result);
    },
      error => console.error(error));
  }
}
