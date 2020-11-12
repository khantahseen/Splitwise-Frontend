import { Component, OnInit } from '@angular/core';
import { UserFriendClient } from 'src/app/shared/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  currentUserId: string = localStorage.getItem("userId");
  myFriendId:number=0;
  constructor(private userFriendClient:UserFriendClient, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
  }
}
