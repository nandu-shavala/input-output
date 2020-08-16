import { Component } from "@angular/core";
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  RouterEvent
} from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { User } from './models/user';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  currentUrl: string;
  currentUrl2: string;
  showLoadingIndicatior = true;
  currentUser: User;

  constructor(public _router: Router,
    location: PlatformLocation,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.showLoadingIndicatior = true;
        location.onPopState(() => {
          window.location.reload();
        });
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf("/") + 1
        );

        var exploded = routerEvent.url.split('/');
        this.currentUrl2 = exploded[1];
      }
      if (routerEvent instanceof NavigationEnd) {
        this.showLoadingIndicatior = false;
      }
      window.scrollTo(0, 0);
    });
  }

  logout() {
    this.authenticationService.logout();
    this._router.navigate(['/authentication/signin']);
  }
}
