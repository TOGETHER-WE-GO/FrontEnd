import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { ChatGroup } from '../models';
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

  getChatGroupDetail(propertyIdentifier: string) {
    return this.http
      .get<ChatGroup>(`${environment.notificationUrl}/api/chatgroups/${propertyIdentifier}`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map((response: ChatGroup) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
}
