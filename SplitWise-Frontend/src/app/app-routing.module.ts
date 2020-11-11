import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';
import { StartUpComponent } from './start-up/start-up.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { ExpenseComponent } from './user/expense/expense.component';
import { ExpensesComponent } from './user/expenses/expenses.component';
import { FriendComponent } from './user/friend/friend.component';
import { FriendsComponent } from './user/friends/friends.component';
import { GroupAddComponent } from './user/group-add/group-add.component';
import { GroupSettlementsComponent } from './user/group-settlements/group-settlements.component';
import { GroupComponent } from './user/group/group.component';
import { GroupsComponent } from './user/groups/groups.component';
import { HomeComponent } from './user/home/home.component';
import { SettlementsComponent } from './user/settlements/settlements.component';
import { UserInfoComponent } from './user/user-info/user-info.component';
import { UserListComponent } from './userlist/user-list/user-list.component';

const routes: Routes = [
  {
    path:'start-up', component:StartUpComponent,children:[
      {path:'userList',component:UserListComponent},
      {path:'',redirectTo:'/login',pathMatch:'full'},
      {path:'login', component:LoginComponent},
      {path:'register', component:RegisterComponent},
      {
        path:'home', component:HomeComponent,children:[
          {path:'',redirectTo:'/start-up/home/dashboard',pathMatch:'full'},
          {path:'dashboard',component:DashboardComponent},
          {path:'all-groups',component:GroupsComponent},
          {path:'group-info/:id',component:GroupComponent},
          {path:'all-friends',component:FriendsComponent},
          {path:'friend-info',component:FriendComponent},
          {path:'all-expenses',component:ExpensesComponent},
          {path:'expense-info',component:ExpenseComponent},
          {path:'settlement',component:SettlementsComponent},
          {path:'settlement-list/:id',component:GroupSettlementsComponent},
          {path:'groupAdd', component:GroupAddComponent}
    
        ]
      }
    ]
  },
  
  {path:'',redirectTo:'/start-up/login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
