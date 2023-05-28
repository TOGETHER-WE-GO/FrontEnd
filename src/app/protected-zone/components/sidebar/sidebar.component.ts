import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { PaginationNotification, Notifications } from 'src/app/shared/models';
import { MenuTab } from 'src/app/shared/models/menutab.model';
import {
  NotificationService,
  SignalRService,
  TokenStorageService,
} from 'src/app/shared/services';
import { PostsComponent } from '../../posts/posts.component';
// import {  } from 'src/app/shared/services/token-storage.service';
// import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isActive!: boolean;
  collapsed!: boolean;
  showMenu!: string;
  pushRightClass!: string;
  loginUser: any;
  isClickNoti: boolean = false;
  unReadNotification: number = 0;
  userNotifications: Notifications[];
  public menuTabs!: MenuTab[];
  public bsModalRef: BsModalRef;

  private subscription = new Subscription();

  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(
    public router: Router,
    private tokenStorageService: TokenStorageService,
    private notificationService: NotificationService,
    private signalRService: SignalRService,
    private modalService: BsModalService,
  ) {
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
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
            url: 'contents/explores/users',
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
        url: '/trip-plan',
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

    this.getUserNotification();

    this.signalRService.notification$.subscribe((event) => {
      if (event.type === 'OnEvent' && event.data) {
        this.userNotifications.unshift(event.data);
        this.unReadNotification = this.unReadNotification + 1;
        // this.signalRService.notification$.next({type: '', data: null})
      }
    });
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
    this.isClickNoti = false;
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

  onMenuClick(item: MenuTab)
  {
    if(item.name == 'Notification')
    {
      this.isClickNoti = !this.isClickNoti;
      this.collapsed = true;
    }else if(item.name == 'Create')
    {
      this.bsModalRef = this.modalService.show(PostsComponent, {
        class: 'modal-dialog modal-lg',
        backdrop: 'static',
        initialState: {width: '500px', height: '300px' },
      });
    }
    else{
      this.router.navigate([`${item.url}`]);
    }
  }

  onLoggedout() {
    localStorage.removeItem('auth-token');
  }

  checkRead(item: Notifications) {
    if(!item.isRead)
      this.subscription.add(this.notificationService.markReadNotification(item.id).subscribe((response: boolean) =>{
        if(response)
          item.isRead = true; 
          this.unReadNotification = this.unReadNotification - 1;
      }))
  }

  formatNotificationContent(item: Notifications): string {
    const content = item.content.replace(
      item.fromUserName,
      `<strong>${item.fromUserName}</strong>`
    );
    return content;
  }

  private getUserNotification() {
    this.subscription.add(
      this.notificationService
        .getUserNotification(this.loginUser.nameid)
        .subscribe((response: PaginationNotification) => {
          (this.unReadNotification = response.countUnReadNotification),
            (this.userNotifications = response.data);
        })
    );
  }
}
