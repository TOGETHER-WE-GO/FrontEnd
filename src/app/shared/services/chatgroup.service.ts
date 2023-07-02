import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { ChatGroup, Member } from '../models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatGroupService extends BaseService {
  private _sharedHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  checkIfUserInGroupChat(propertyIdentifier: string, userId: string) {
    return this.http
      .get<boolean>(
        `${environment.notificationUrl}/api/chatgroups/${propertyIdentifier}/users/${userId}/is-member`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(
        map((response: boolean) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  addMemberToChatGroup(propertyIdentifier: string, user: Member)
  {
    return this.http.patch<boolean>(
      `${environment.notificationUrl}/api/chatgroups/${propertyIdentifier}/add-to-group`,
      user
    );
  }

  removeMemberFromGroupChat(propertyIdentifier: string, memberId: string)
  {
    return this.http.delete<boolean>(
      `${environment.notificationUrl}/api/chatgroups/${propertyIdentifier}/members/${memberId}/remove-from-group`
    );  
  }

  getChatGroupDetail(propertyIdentifier: string) {
    return this.http
      .get<ChatGroup>(
        `${environment.notificationUrl}/api/chatgroups/${propertyIdentifier}`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(
        map((response: ChatGroup) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
}
