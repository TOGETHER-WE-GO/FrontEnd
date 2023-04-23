import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlaceOverall, Rating } from '../models';
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
      .get<PlaceOverall[]>(`${environment.exploreurl}/api/places`, {
        headers: this._sharedHeaders,
        params
      })
      .pipe(
        map((response: PlaceOverall[]) => {
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

  updateUserRating(entity: Rating) {
    let url = `${environment.exploreurl}/api/places/view`
    const blob = new Blob([JSON.stringify(entity)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      const success = navigator.sendBeacon(url, blob);
      if (!success) {
        console.error('Beacon transmission failed.');
      }
    } else {
      console.error('sendBeacon is not supported in this browser.');
    }
  }
}
