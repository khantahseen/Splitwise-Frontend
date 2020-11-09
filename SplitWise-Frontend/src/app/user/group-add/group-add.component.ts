import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupMemberAC, GroupMember, Groups, GroupsAC, GroupsClient, UsersAC, UserFriendClient, GroupMemberClient } from 'src/app/shared/data.service';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css']
})
export class GroupAddComponent implements OnInit {

  group: Groups = new Groups();
  resultGroup: number = 0;
  groupmember: GroupMember = new GroupMember();
  members: UsersAC[] = [];
  friends: UsersAC[];
  groupData: any = {
    Id: 0,
    Name: null,
    AdminId: null,
    User: null
  };

  memberData: any = {
    Id: 0,
    GroupId: 0,
    Group: null,
    MemberId: null,
    User: null
  };
  groupAdminId: string = localStorage.getItem("userId");
  currentUserName: string = localStorage.getItem("userFullName");

  constructor(private groupClient: GroupsClient, private userFriendClient: UserFriendClient,
    private groupMemberClient: GroupMemberClient, private route: Router) { }

  ngOnInit(): void {
    console.log(this.currentUserName);
    this.getFriends(this.groupAdminId);
  }

  getFriends(id: string) {
    this.userFriendClient.getAllFriends(id).subscribe(result => {
      this.friends = result;
      console.log(this.friends);
    },
      error => console.error());
  }

  onSelect(checked: boolean, id: string) {
    if (checked === true) {
      this.members.push(this.friends.find(k => k.id === id));
    }
    else {
      //remove from array
      const x = this.members.find(k => k.id === id);
      this.members = this.members.filter(k => k !== x);
    }
    console.log(this.members);
  }

  add() {
    console.log('Adding new group!');
    this.groupData.AdminId = this.groupAdminId;
    this.group.init(this.groupData);
    console.log(this.groupData);
    console.log(this.group);
    this.groupClient.postGroups(this.group).subscribe(result => {
      this.resultGroup = result;
      this.memberData.GroupId = this.resultGroup;
      console.log(this.memberData.GroupId);
      for (const x of this.members) {
  
        this.memberData.MemberId = x.id;
        console.log(this.memberData);
        this.groupmember.init(this.memberData);
        console.log(this.groupmember);
        this.groupMemberClient.postGroupMember(this.groupmember).subscribe(result => {
          console.log(result);
        },
          error => console.log(error));
      }
      console.log(this.resultGroup);
    },
      error => console.log(error));
    }
}