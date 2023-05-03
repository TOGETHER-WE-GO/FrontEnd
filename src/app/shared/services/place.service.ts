import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PlaceFeatureType, PlaceOverall, UpdateUserInteraction } from '../models';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs';
import { PlaceDetail } from '../models/places/place-detail';

@Injectable({
  providedIn: 'root',
})
export class PlaceService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  search(searchKey: string, placeType: string[], page:number, pageSize: number) {
    let params = new HttpParams()
            .set('searchKey', searchKey)
            .set('page', page)
            .set('pageSize', pageSize)
            .set('placeType', JSON.stringify(placeType))
            
    return this.http
      .get<Pagination<PlaceOverall>>(`${environment.exploreurl}/api/places`, {
        headers: this._sharedHeaders,
        params
      })
      .pipe(
        map((response: Pagination<PlaceOverall>) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getPlaceTypes() {
    return this.http
      .get<PlaceFeatureType[]>(`${environment.exploreurl}/api/places/place-type`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map((response: PlaceFeatureType[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getPlaceDetail(id: number) {
    return this.http
      .get<PlaceDetail>(`${environment.exploreurl}/api/places/${id}`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map((response: PlaceDetail) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }
}
