import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PayersAC,PayeesAC,ExpensesAC,PayeesClient,PayersClient, ExpensesClient, GroupMemberAC ,GroupMemberClient} from 'src/app/shared/data.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  constructor(private expenseClient:ExpensesClient,private activatedRoute:ActivatedRoute,
    private payerClient:PayersClient, private payeeClient:PayeesClient, private groupMemberClient:GroupMemberClient) { }
  
  expenses:ExpensesAC[];
  payers : PayersAC[];
  payees : PayeesAC[];
  groupmembers:GroupMemberAC[];
  groupId:number;
  showIds: number[] = [];
  groupName: string = "";
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(e=>{
      this.groupId=+e.get('id');
      this.getExpensesbyGroupId(this.groupId);
      this.getMembersbyGroupId(this.groupId);
    });
  }
  
  getExpensesbyGroupId(id:number){
    this.expenseClient.getExpensesByGroupId(id).subscribe(result=>{
      this.expenses=result;
      console.log(this.expenses);
    },
    error=>console.error());
  }
  
  getMembersbyGroupId(id:number){
    this.groupMemberClient.getGroupMember(id).subscribe(result=>{
      this.groupmembers=result;
      console.log(this.groupmembers);
    },
    error=>console.error());
  }
  
  showCard(id: number) {

    if (this.showIds.indexOf(id) != -1) {
      this.showIds.splice(this.showIds.indexOf(id), 1);
    }
    else {
      this.showIds.push(id);
    }
    this.payerClient.getPayersByExpenseId(id).subscribe(result => {
      this.payers=result;
    },
    error=>console.error(error));
    this.payeeClient.getPayeesByExpenseId(id).subscribe(result =>{
      this.payees=result;
    },
    error=>console.error(error));
  }
 
}
