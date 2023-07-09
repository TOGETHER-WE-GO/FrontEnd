import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UserFollow } from 'src/app/shared/models';
import {
  NotificationService,
  SignalRService,
  TokenStorageService,
} from 'src/app/shared/services';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Subscription } from 'rxjs';
import { RemoveFollowRequestEvent } from 'src/app/shared/_helpers/constant';

@Component({
  selector: 'app-activeuser',
  templateUrl: './activeuser.component.html',
  styleUrls: ['./activeuser.component.scss'],
})
export class ActiveuserComponent implements OnInit, OnDestroy {
  public followings: UserFollow[] = [];

  // carousel config
  customOptions: any = {
    loop: false,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 8,
      },
      400: {
        items: 8,
      },
      740: {
        items: 8,
      },
      940: {
        items: 8,
      },
    },
    nav: true,
  };
  userId: string;
  test = 1;
  private subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private signalRService: SignalRService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserTokenInfo()?.nameid;

    this.subscription.add(
      this.notificationService
        .getUserActiveFollowings(this.userId)
        .subscribe((response: UserFollow[]) => {
          this.followings = response;
        })
    );

    this.signalRService.followingsObservable.subscribe((event) => {
      if (event.type == 'Disconnect' && event.data == null) {
        this.followings = [];
      } else if (event.type === 'OnLogin' || event.type === 'OnLogout') {
        if (event.type === 'OnLogin') this.followings.push(event.data);
        else {
          const indexOfObject = this.followings.findIndex((object) => {
            return object.userId === event.data.userId;
          });

          if (indexOfObject !== -1) {
            this.followings.splice(indexOfObject, 1);
          }
        }
      } 
      // else if (event.type === 'OnEvent') {
      //   if (event.data.title == RemoveFollowRequestEvent) {
      //     const index = this.followings.indexOf(event.data.fromUserId, 0);
      //     if (index > -1) {
      //       this.followings.splice(index, 1);
      //     }
      //   }
      // }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
