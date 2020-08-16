import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import { AppSettings } from '../global';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient,
    private router: Router) {
    this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  login(body: { username: any; password: any; }) {
    return this.httpClient.post(AppSettings.LOGIN_ENDPOINT,
      {
        uname: body.username,
        pwd: body.password
      }
    ).pipe(map(res => {
      // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
      // user.authdata = window.btoa(body.username + ':' + body.password);
      let user: User = res["data"]
      localStorage.setItem('currentUser', JSON.stringify(user as User));
      this.currentUserSubject.next(user as User);
      return res;
    }));
  }

  // login(username: string, password: string) {

  //   return this.http.post(`${environment.apiUrl}/users/authenticate`, { username, password })
  //     .pipe(map(user => {
  //       // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
  //       user.authdata = window.btoa(username + ':' + password);
  //       localStorage.setItem('currentUser', JSON.stringify(user));
  //       this.currentUserSubject.next(user as User);
  //       return user;
  //     }));
  // }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/authentication/signin']);
  }
}
