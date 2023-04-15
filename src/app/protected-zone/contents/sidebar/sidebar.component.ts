import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuTab } from 'src/app/shared/models/menutab.model';
// import {  } from 'src/app/shared/services/token-storage.service';
// import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive!: boolean;
    collapsed!: boolean;
    showMenu!: string;
    pushRightClass!: string;
    public menuTabs!: MenuTab[];

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(public router: Router) {
        this.loadMenu();
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    loadMenu(){
        this.menuTabs = [
            {
                name: "Home",
                url: "/test",
                icon: "fa-desktop",
                sortOrder: 1
            },
            {
                name: "Search",
                url: "/test",
                icon: "fa-desktop",
                sortOrder: 2
            },
            {
                name: "Explore",
                url: "/test",
                icon: "fa-desktop",
                sortOrder: 3
            },
            {
                name: "Notification",
                url: "/test",
                icon: "fa-desktop",
                sortOrder: 4
            },
            {
                name: "Create",
                url: "/test",
                icon: "fa-desktop",
                sortOrder: 5
            }
        ]
    }

    ngOnInit() {
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
    }

    eventCalled() {
        this.isActive = !this.isActive;
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
