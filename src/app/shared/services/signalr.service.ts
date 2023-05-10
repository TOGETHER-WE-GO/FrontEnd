import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserFollow } from '../models';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  public hubConnection: signalR.HubConnection;
  private _sharedHeaders = new HttpHeaders();
  followingsObservable = new BehaviorSubject({type: '', data: null});

  constructor(private tokenService: TokenStorageService) {
    const connectionId = localStorage.getItem('signalrConnectionId');

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:5044/hub?access_token=${tokenService.getToken()}`)
      .withAutomaticReconnect()
      .build(); 
      
  }

  public startConnection(): Observable<void> {
    return new Observable<void>((observer) => {
      this.hubConnection
        .start()
        .then(() => {
          console.log('SignalR connection started');
          observer.next();
          observer.complete();
        })
        .catch((err) => {
          console.log('Error while starting SignalR connection: ', err);
          observer.error(err);
        });
    });
  }

  //   public registerUserConnectedHandler(handler: (connectionId: string) => void): void {
  //     this.hubConnection.on('OnLogin', (connectionId) => {
  //         console.log('user connected');
  //       handler(connectionId);
  //     });
  //   }

  //   public registerUserDisconnectedHandler(handler: (connectionId: string) => void): void {
  //     this.hubConnection.on('OnLogout', (connectionId) => {
  //         console.log('user disconet');
  //       handler(connectionId);
  //     });
  //   }

  public registerUserConnectedHandler = () => {
    this.hubConnection.on('OnLogin', (data: UserFollow) => {
      this.followingsObservable.next({type: 'OnLogin', data: data});
    });
  };

  public registerUserDisconnectedHandler = () => {
    this.hubConnection.on('OnLogout', (data: UserFollow) => {
      this.followingsObservable.next({type: 'OnLogout', data: data});
    });
  };

  public getConnectionId(): string {
    return this.hubConnection.connectionId;
  }
}
