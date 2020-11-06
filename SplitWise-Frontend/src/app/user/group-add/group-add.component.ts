import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Groups,GroupsAC,GroupsClient } from 'src/app/shared/data.service';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css']
})
export class GroupAddComponent implements OnInit {
  group:Groups=new Groups();
  groupData:any={
    Id:0,
    Name:null,
    AdminId:null,
    User:null
};
  
  constructor(private groupClient:GroupsClient,private route:Router) { 
    this.groupData.AdminId="0fab5daf-928b-408f-9b23-6d8c7fb95d19";
  }
  
  ngOnInit(): void {
  }

  add(){
    console.log('Adding new group!');
    
    this.groupClient.postGroups(this.group).subscribe(result=>{
      console.log(result);
    },
    error=>console.log(error));
  }
}