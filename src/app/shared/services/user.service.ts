import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { map, catchError, Observable, BehaviorSubject } from 'rxjs';
import {
  UserActivity,
  UserFollow,
  User,
  FollowRequest,
  UserPlaceInteraction,
  UpdateUserInteraction,
  Pagination,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  isChangeProfile$ = new BehaviorSubject(false);

  private _sharedHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  searchDiscoveryUser(searchKey: string, page: number, pageSize: number) {
    let params = new HttpParams()
      .set('searchKey', searchKey)
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http
      .get<Pagination<User>>(`${environment.exploreurl}/api/users`, {
        headers: this._sharedHeaders,
        params,
      })
      .pipe(
        map((response: Pagination<User>) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getUserProfile(userId: string) {
    return this.http
      .get<User>(
        `${environment.apiUrl}/api/authmanagement/profiles/${userId}`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(
        map((response: User) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  uploadAvatar(userId: string, formData: FormData) {
    return this.http.post<any>(
      `${environment.apiUrl}/api/users/${userId}/avatar`,
      formData
    );
  }

  updateUserProfile(userId: string, data: FormData) {
    return this.http.post<any>(
      `${environment.apiUrl}/api/users/${userId}/profiles`,
      data
    );
  }

  getUserActivity(userId: string) {
    return this.http
      .get<UserActivity>(
        `${environment.exploreurl}/api/users/${userId}/activities`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(
        map((response: UserActivity) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getUserPlaceInteraction(userId: string, placeId: number) {
    return this.http
      .get<UserPlaceInteraction>(
        `${environment.exploreurl}/api/users/${userId}/place-interaction/${placeId}`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(
        map((response: UserPlaceInteraction) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  createRating(userId: string, placeId: number, rating: number) {
    let request: UpdateUserInteraction = {
      userId: userId,
      placeId: placeId,
      score: rating,
    };

    return this.http
      .post(
        `${environment.exploreurl}/api/users/${userId}/rating/${placeId}`,
        request,
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .pipe(catchError(this.handleError));
  }

  updateUserView(entity: UpdateUserInteraction) {
    let url = `${environment.exploreurl}/api/users/${entity.userId}/view/${entity.placeId}`;
    const blob = new Blob([JSON.stringify(entity)], {
      type: 'application/json',
    });
    if (navigator.sendBeacon) {
      const success = navigator.sendBeacon(url, blob);
      if (!success) {
        console.error('Beacon transmission failed.');
      }
    } else {
      console.error('sendBeacon is not supported in this browser.');
    }
  }

  checkIsFollowing(userId: string, targetId: string) {
    return this.http
      .get<boolean>(
        `${environment.exploreurl}/api/users/${userId}/following/${targetId}/is-following`,
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

  checkIsReceivingFollowRequest(userId: string, targetId: string) {
    return this.http
      .get<boolean>(
        `${environment.exploreurl}/api/users/${userId}/follow-requests/${targetId}/is-receiving`,
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

  checkIsSendingFolowRequest(userId: string, targetId: string) {
    return this.http
      .get<boolean>(
        `${environment.exploreurl}/api/users/${userId}/follow-requests/${targetId}/is-requesting`,
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

  getUserFollower(userId: string) {
    return this.http
      .get<UserFollow[]>(
        `${environment.exploreurl}/api/users/${userId}/followers`,
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

  acceptFollowRequest(data: FollowRequest) {
    return this.http.post<any>(
      `${environment.exploreurl}/api/users/follow-accept`,
      data
    );
  }

  getUserFollowing(userId: string) {
    return this.http
      .get<UserFollow[]>(
        `${environment.exploreurl}/api/users/${userId}/following`,
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

  sendFollowRequest(request: FollowRequest): Observable<any> {
    return this.http
      .post(`${environment.exploreurl}/api/users/follow-request`, request, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.handleError));
  }

  removeFollow(sourceId: string, targetId: string): Observable<any> {
    return this.http
      .delete(`${environment.exploreurl}/api/users/${sourceId}/follows/${targetId}`)
      .pipe(catchError(this.handleError));
  }

  removeFollowRequest(sourceId: string, targetId: string): Observable<any> {
    return this.http
      .delete(`${environment.exploreurl}/api/users/${sourceId}/follow-requests/${targetId}`)
      .pipe(catchError(this.handleError));
  }
}
