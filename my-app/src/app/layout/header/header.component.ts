import { DOCUMENT } from '@angular/common';
import { Component, Inject, ElementRef, OnInit, Renderer2, HostListener } from '@angular/core';
import { RightSidebarService } from '../../services/rightsidebar.service';
import { WINDOW } from "../../services/window.service";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { CommonService } from 'src/app/_helpers/common.service';

const document: any = window.document;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  isNavbarShow: boolean;
  collapseTitle: string = 'Collapse';

  currentUser: User;


  constructor(
    @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window: Window,
    private renderer: Renderer2, public elementRef: ElementRef, private dataService: RightSidebarService,
    private authenticationService: AuthenticationService,
    private _commonService: CommonService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }


  @HostListener("window:scroll", [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    if (offset > 50) {
      this.isNavbarShow = true;
    } else {
      this.isNavbarShow = false;
    }
  }

  ngOnInit() {
    this.setStartupStyles();

  }

  setStartupStyles() {
    //set theme on startup
    if (localStorage.getItem("theme")) {
      this.renderer.removeClass(this.document.body, 'dark');
      this.renderer.removeClass(this.document.body, 'light');
      this.renderer.addClass(this.document.body, localStorage.getItem("theme"));
    } else {
      this.renderer.addClass(this.document.body, 'light');
    }

    // set light sidebar menu on startup
    if (localStorage.getItem("menu_option")) {
      this.renderer.addClass(this.document.body, localStorage.getItem("menu_option"));
    }
    else {
      this.renderer.addClass(this.document.body, 'menu_light');
    }

    // set logo color on startup
    if (localStorage.getItem("choose_logoheader")) {
      this.renderer.addClass(this.document.body, localStorage.getItem("choose_logoheader"));
    } else {
      this.renderer.addClass(this.document.body, 'logo-white');
    }
  }

  callFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains("side-closed");
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      this.collapseTitle = 'Collapse'

    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      this.collapseTitle = 'Expand'
    }



  }

  getImage(user) {
    return this._commonService.getImage(user);
  }

  public toggleRightSidebar(): void {
    this.dataService.changeMsg(this.dataService.currentStatus._isScalar = !this.dataService.currentStatus._isScalar);
  }
  public logout() {
    this.authenticationService.logout();
  }
}
