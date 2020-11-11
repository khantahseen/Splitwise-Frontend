import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartUpComponent } from './start-up/start-up.component';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { GroupsComponent } from './user/groups/groups.component';
import { GroupComponent } from './user/group/group.component';
import { FriendsComponent } from './user/friends/friends.component';
import { FriendComponent } from './user/friend/friend.component';
import { ExpensesComponent } from './user/expenses/expenses.component';
import { ExpenseComponent } from './user/expense/expense.component';
import { SettlementsComponent } from './user/settlements/settlements.component';
import { UserInfoComponent } from './user/user-info/user-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './user/home/home.component';
import { UserListComponent } from './userlist/user-list/user-list.component';
import { GroupAddComponent } from './user/group-add/group-add.component';
import { AbsolutePipe } from './absolute.pipe';


@NgModule({
  declarations: [
    AppComponent,
    StartUpComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    GroupsComponent,
    GroupComponent,
    FriendsComponent,
    FriendComponent,
    ExpensesComponent,
    ExpenseComponent,
    SettlementsComponent,
    UserInfoComponent,
    HomeComponent,
    UserListComponent,
    GroupAddComponent,
    AbsolutePipe,
   
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
