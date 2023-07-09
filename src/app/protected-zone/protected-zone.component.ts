import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  SignalRService,
  NotificationService,
  TokenStorageService,
} from '../shared/services';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { UserFollow } from '../shared/models';

@Component({
  selector: 'app-protected-zone',
  templateUrl: './protected-zone.component.html',
  styleUrls: ['./protected-zone.component.scss'],
})
export class ProtectedZoneComponent implements OnInit, OnDestroy {
  collapedSideBar!: boolean;

  private subscription = new Subscription();
  private userId: string;

  constructor(
    private signalrService: SignalRService,
    private notificationService: NotificationService,
    private tokenService: TokenStorageService
  ) {
    this.userId = tokenService.getUserTokenInfo()?.nameid;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    // this.signalrService.startConnection().subscribe();

    // this.subscription.add(
    //   this.notificationService
    //     .getUserActiveFollowings(this.userId)
    //     .subscribe((response: UserFollow[]) => {
    //       this.signalrService.followingsObservable.next(response);
    //     })
    // );

    // this.signalrService.registerUserConnectedHandler();
    // this.signalrService.registerUserDisconnectedHandler();
    if(!this.signalrService.hubConnection)
    {
      this.signalrService.establishConnection();
    }
    
    if (
      this.signalrService.hubConnection && this.signalrService.hubConnection.state === HubConnectionState.Connected
    ) {
      // SignalR connection is already established, no need to reconnect
      return;
    }

    this.signalrService.startConnection().subscribe();

    this.signalrService.registerUserConnectedHandler();
    this.signalrService.registerUserDisconnectedHandler();
    this.signalrService.registerUserEventHandler();
    this.signalrService.onReceiveMessage();
  }

  receiveCollapsed($event: any) {
    this.collapedSideBar = $event;
  }
}
