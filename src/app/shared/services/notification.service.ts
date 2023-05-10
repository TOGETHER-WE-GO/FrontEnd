import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs';
import { UserFollow } from '../models';

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
      .get<UserFollow[]>(`${environment.notificationUrl}/api/users/${userId}/active-following`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map((response: UserFollow[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
}
