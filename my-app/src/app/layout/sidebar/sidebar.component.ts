import { DOCUMENT } from '@angular/common';
import { Component, Inject, ElementRef, OnInit, Renderer2, HostListener } from '@angular/core';
import { ROUTES } from './sidebar-items';

declare const Waves: any;
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  currentUrl: string;
  currentUrl2: string;
  public sidebarItems: any[];
  showMenu: string = '';
  showSubMenu: string = '';
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  headerHeight = 60;
  collapseTitle: string = 'Collapse';

  currentUser: User;

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, location: PlatformLocation,
    private renderer: Renderer2, public elementRef: ElementRef,
    private authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }
  @HostListener('window:resize', ['$event'])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }

  callMenuToggle(event: any, element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';

    } else {
      this.showMenu = element;
    }
    const hasClass = event.target.classList.contains("toggled");
    if (hasClass) {
      this.renderer.removeClass(event.target, "toggled");
    } else {
      this.renderer.addClass(event.target, "toggled");
    }
    this.getroute();

  }


  getroute() {
    setTimeout(() => {
      var routerEvent = window.location.hash;
      this.currentUrl = routerEvent.substring(
        routerEvent.lastIndexOf("/") + 1
      );

      var exploded = routerEvent.split('/');
      if (exploded.length > 1) {


        this.currentUrl2 = exploded[1].charAt(0).toUpperCase() + exploded[1].slice(1);
      }

    }, 200);

  }





  callSubMenuToggle(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';

    } else {
      this.showSubMenu = element;
    }

    this.getroute();
    this.renderer.removeClass(this.document.body, 'overlay-open');
  }

  ngOnInit() {
    this.sidebarItems = ROUTES.filter(sidebarItem => {
      if (sidebarItem.allow.includes(this.currentUser.role))
        return sidebarItem
    });

    this.initLeftSidebar();
    this.bodyTag = this.document.body;
    this.getroute();
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains("side-closed");
    const hasClass2 = this.document.body.classList.contains("side-closed-hover");
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      this.collapseTitle = 'Collapse'

    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      if (!hasClass2) {
        this.renderer.addClass(this.document.body, 'submenu-closed');
      }
      this.collapseTitle = 'Expand'
    }

  }
  initLeftSidebar() {

    var _this = this;
    //Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
    // //Set Waves
    // Waves.attach(".menu .list a", ["waves-block"]);
    // Waves.init();

  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    var height = (this.innerHeight - (this.headerHeight));
    this.listMaxHeight = height + "";
    this.listMaxWidth = '500px';
  }

  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, "ls-closed");
    }
    else {
      this.renderer.removeClass(this.document.body, "ls-closed");
    }
  }


  mouseHover(e) {

    let body = this.elementRef.nativeElement.closest('body');

    if (body.classList.contains("submenu-closed")) {
      this.renderer.addClass(this.document.body, "side-closed-hover");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    }


  }
  mouseOut(e) {
    let body = this.elementRef.nativeElement.closest('body');

    if (body.classList.contains("side-closed-hover")) {
      this.renderer.removeClass(this.document.body, "side-closed-hover");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }
}
