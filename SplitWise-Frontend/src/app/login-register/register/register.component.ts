import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Register, UsersClient } from 'src/app/shared/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  register:Register=new Register();
  registerData:any={
    Name:null,
    Email:null,
    Password:null
  }
  constructor(private userClient:UsersClient,private route:Router) { }

  ngOnInit(): void {
  }

  registerUser(){
    this.register.init(this.registerData);
    this.userClient.register(this.register).subscribe(result=>{
      console.log(result);
      this.route.navigateByUrl(`/start-up/login`)
          .then(() => {
            window.location.reload();
          });
    });
  }
}
