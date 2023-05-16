import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs';
import { PaginationNotification, UserFollow } from '../models';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  getUserActiveFollowings(userId: string) {
    return this.http
      .get<UserFollow[]>(
        `${environment.notificationUrl}/api/users/${userId}/active-following`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(
        map((response: UserFollow[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getUserNotification(userId: string) {
    let params = new HttpParams().set('userId', userId);

    return this.http
      .get<PaginationNotification>(
        `${environment.notificationUrl}/api/notifications`,
        {
          headers: this._sharedHeaders,
          params,
        }
      )
      .pipe(
        map((response: PaginationNotification) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  markReadNotification(notificationId: string) {
    return this.http
      .patch<boolean>(
        `${environment.notificationUrl}/api/notifications/${notificationId}`,
        {
          headers: this._sharedHeaders,
          responseType: 'text',
        }
      )
      .pipe(catchError(this.handleError));
  }
}
