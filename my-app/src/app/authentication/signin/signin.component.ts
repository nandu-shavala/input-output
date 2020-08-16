import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

declare const $: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  message = "";

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberme: ['']
    });

    if (localStorage.getItem("rememberme") == "1") {
      this.f.rememberme.setValue(true);
      this.f.username.setValue(localStorage.getItem("username"));
      this.f.password.setValue(localStorage.getItem("password"));
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    //    [Focus input] * /
    $('.input100').each(function () {
      $(this).on('blur', function () {
        if ($(this).val().trim() != "") {
          $(this).addClass('has-val');
        }
        else {
          $(this).removeClass('has-val');
        }
      })
    })
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.message = "";
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.authenticationService.login({
      username: this.f.username.value,
      password: this.f.password.value
    }).subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        // sessionStorage.setItem('user', response.data);
        let rememberme = this.f.rememberme.value;
        if (rememberme) {
          localStorage.setItem('rememberme', this.f.rememberme.value ? "1" : "0");
          localStorage.setItem('username', this.f.username.value);
          localStorage.setItem('password', this.f.password.value);
        }
        else {
          localStorage.setItem('rememberme', "0");
          localStorage.setItem('username', null);
          localStorage.setItem('password', null);
        }
        this.router.navigate(['/dashboard/main']);
      }
      else {
        sessionStorage.setItem('user', "");
        this.message = response.message
        return;
      }
    })
  }
}
