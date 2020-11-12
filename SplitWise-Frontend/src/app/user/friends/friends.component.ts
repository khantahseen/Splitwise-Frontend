import { Component, OnInit } from '@angular/core';
import { NewFriendAC, UsersAC, UsersClient, UserFriendClient } from 'src/app/shared/data.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  userList: UsersAC[]=[];
  myFriendEmail:string='';
  currentUserId:string = localStorage.getItem("userId");
  friend:NewFriendAC=new NewFriendAC();
  constructor(private userClient: UsersClient, private friendClient: UserFriendClient) { }

  ngOnInit(): void {
    this.getUserList();
  }
  getUserList() {
    this.userClient.getUsers().subscribe(result => {
      this.userList = result;
    },
      error => console.error(error));
  }
add(){
let friendDetail={
  UserId: this.currentUserId,
  UserFriendEmail: this.myFriendEmail
}
this.friend.init(friendDetail);
this.friendClient.addFriend(this.friend).subscribe(()=>{
window.location.reload();
},
error=>console.error(error));
}
}
