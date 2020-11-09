import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginAC, UsersClient } from 'src/app/shared/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error:number;
  
  constructor(private userClient:UsersClient,private route:Router) { }
  loginuser: LoginAC = new LoginAC();
  loginData : any={
    Email: null,
    Password:null
  };
  ngOnInit(): void {
  }
  
  loginUser(){
    this.loginuser.init(this.loginData);
    console.log(this.loginuser);
    this.userClient.login(this.loginuser).subscribe(
      result=>{
        localStorage.setItem('authToken',result.token);
        let jwtData=result.token.split('.')[1];
        let decodedJwtJsonData = JSON.parse(window.atob(jwtData));
        console.log(result.token);
        console.log(decodedJwtJsonData);
        localStorage.setItem('userName', decodedJwtJsonData.name);
        console.log('Localname:'+localStorage.getItem('userName'));
        localStorage.setItem('userId', decodedJwtJsonData.userid);
        console.log('LocalId:'+localStorage.getItem('userId'));
        localStorage.setItem('userFullName', decodedJwtJsonData.userfullname);
        console.log('LocalFullName:'+localStorage.getItem('userFullName'));
        console.log("Login successfull.");
      }
    )
  }
}
