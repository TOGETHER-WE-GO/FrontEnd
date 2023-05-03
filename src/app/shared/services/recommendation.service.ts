import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlaceOverall, UpdateUserInteraction } from '../models';
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
    let params = new HttpParams()
      .set('placeType', JSON.stringify(placeType));

    return this.http
      .get<PlaceOverall[]>(
        `${environment.exploreurl}/api/recommendation/places/${id}`,
        {
          headers: this._sharedHeaders,
          params
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
