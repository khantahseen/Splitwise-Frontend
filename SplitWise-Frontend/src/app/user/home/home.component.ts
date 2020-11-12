import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupsAC, GroupsClient, UserFriendClient, UsersAC } from 'src/app/shared/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  name=localStorage.getItem('userFullName');
  userid: string = localStorage.getItem("userId");
  groups:GroupsAC[];
  friends:UsersAC[];
  
  constructor(private groupClient:GroupsClient,private route:Router,private userFriendClient:UserFriendClient,
    private router:Router) { 
   
  }

  ngOnInit(): void {
    this.groupClient.getGroupsByUserId(this.userid).subscribe(result=>{
      this.groups=result;
      console.log(this.groups);
    },
    error=>console.error(error));
   

    this.userFriendClient.getAllFriends(this.userid).subscribe(result=>{
      this.friends=result;
      console.log(this.friends);
    },
    error=>console.error());
    
  }

  logout(){
    localStorage.clear();
    let token=localStorage.getItem("authToken");
    console.log(token);
    this.router.navigateByUrl(`/start-up/login`)
          .then(() => {
            window.location.reload();
          });
  }
}
