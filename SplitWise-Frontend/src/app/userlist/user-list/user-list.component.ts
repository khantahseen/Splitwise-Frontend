import { Component, OnInit } from '@angular/core';
import { UsersAC,UsersClient } from 'src/app/shared/data.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users:UsersAC[];
  constructor(usersClient:UsersClient) { 
    usersClient.getUsers().subscribe(result=>{
      this.users=result;
      console.log(this.users);
    },
    error=>console.error(error));
    
  }

  ngOnInit(): void {
  }

}

