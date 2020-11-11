import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettlementsAC, SettlementsClient } from 'src/app/shared/data.service';

@Component({
  selector: 'app-group-settlements',
  templateUrl: './group-settlements.component.html',
  styleUrls: ['./group-settlements.component.css']
})
export class GroupSettlementsComponent implements OnInit {
  settlements:SettlementsAC[];
  groupId:number=0;
  constructor(private settlementClient:SettlementsClient, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(e => {
      this.groupId = +e.get('id');
    });
    this.settlementClient.getSettlementsByGroupId(this.groupId).subscribe(result=>{
      this.settlements = result;
      console.log(this.settlements);
    });
  }

}
