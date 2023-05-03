import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuTab } from 'src/app/shared/models/menutab.model';
import { TokenStorageService } from 'src/app/shared/services';
// import {  } from 'src/app/shared/services/token-storage.service';
// import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isActive!: boolean;
  collapsed!: boolean;
  showMenu!: string;
  pushRightClass!: string;
  loginUser: any;
  public menuTabs!: MenuTab[];

  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(public router: Router, private tokenStorageService: TokenStorageService) {
    this.loadMenu();
    this.router.events.subscribe((val) => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  loadMenu() {
    this.menuTabs = [
      {
        name: 'Home',
        url: '/',
        icon: 'fa-home',
        sortOrder: 1,
        children: [],
      },
      {
        name: 'Explore',
        url: '/test',
        icon: 'fa-globe',
        sortOrder: 2,
        children: [
          {
            name: 'User',
            url: 'contents/explores/user',
            icon: 'fa-user',
            sortOrder: 1,
            children: [],
          },
          {
            name: 'Place',
            url: 'contents/explores',
            icon: 'fa-map-marker',
            sortOrder: 2,
            children: [],
          },
        ],
      },
      {
        name: 'Messages',
        url: '/test',
        icon: 'fa-telegram',
        sortOrder: 3,
        children: [],
      },
      {
        name: 'Notification',
        url: '/test',
        icon: 'fa-bell',
        sortOrder: 4,
        children: [],
      },
      {
        name: 'Create',
        url: '/test',
        icon: 'fa-plus-square',
        sortOrder: 5,
        children: [],
      },
    ];
  }

  ngOnInit() {
    this.loginUser = this.tokenStorageService.getUserTokenInfo();
    this.isActive = false;
    this.collapsed = false;
    this.showMenu = '';
    this.pushRightClass = 'push-right';
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
        this.showMenu = '0';
    } else {
        this.showMenu = element;
    }
}

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body') as Element;
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  onLoggedout() {
    localStorage.removeItem('isLoggedin');
  }
}
