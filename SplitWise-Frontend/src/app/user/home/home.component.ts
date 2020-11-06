import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupsAC, GroupsClient, UserFriendClient, UsersAC } from 'src/app/shared/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  groups:GroupsAC[];
  friends:UsersAC[];
  constructor(private groupClient:GroupsClient,private route:Router,private userFriendClient:UserFriendClient) { 
   
  }

  ngOnInit(): void {
    this.groupClient.getGroupsByUserId("0fab5daf-928b-408f-9b23-6d8c7fb95d19").subscribe(result=>{
      this.groups=result;
      console.log(this.groups);
    },
    error=>console.error(error));
   

    this.userFriendClient.getAllFriends("0fab5daf-928b-408f-9b23-6d8c7fb95d19").subscribe(result=>{
      this.friends=result;
      console.log(this.friends);
    },
    error=>console.error());
    
  }
}
