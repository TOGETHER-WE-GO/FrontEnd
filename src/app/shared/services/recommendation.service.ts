import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlaceOverall, FollowMutualRecommend } from '../models';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs';
import { PlaceDetail } from '../models/places/place-detail';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  recommendPlaceByContent(id: number, placeType: string[]) {
    let params = new HttpParams().set('placeType', JSON.stringify(placeType));

    return this.http
      .get<PlaceOverall[]>(
        `${environment.exploreurl}/api/recommendation/places/${id}`,
        {
          headers: this._sharedHeaders,
          params,
        }
      )
      .pipe(
        map((response: PlaceOverall[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  recommendFollowBySameInterest(userId: string) {
    return this.http
      .get<FollowMutualRecommend[]>(
        `${environment.exploreurl}/api/recommendation/users/${userId}/same-interest`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(
        map((response: FollowMutualRecommend[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  recommendFollowByMutualFollowing(userId: string) {
    return this.http
      .get<FollowMutualRecommend[]>(
        `${environment.exploreurl}/api/recommendation/users/${userId}/follows-mutual`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(
        map((response: FollowMutualRecommend[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  recommendPlaceNearby(id: number, placeType: string[], limit: number) {
    let params = new HttpParams().set('limit', limit).set('placeType', JSON.stringify(placeType));

    return this.http
      .get<PlaceOverall[]>(
        `${environment.exploreurl}/api/recommendation/places/${id}/nearby`,
        {
          headers: this._sharedHeaders,
          params,
        }
      )
      .pipe(
        map((response: PlaceOverall[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  recommendPlacesForUser(userId: string) {
    return this.http
      .get<PlaceOverall[]>(
        `${environment.exploreurl}/api/recommendation/users/${userId}/places`,
        {
          headers: this._sharedHeaders,
        }
      )
      .pipe(
        map((response: PlaceOverall[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
}
