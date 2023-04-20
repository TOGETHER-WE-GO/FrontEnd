import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  search(keyword: string) {
    return this.http
      .get<PlaceOverall[]>(`${environment.exploreurl}/api/places?search=Quan`, {
        headers: this._sharedHeaders,
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
    let xhr = new XMLHttpRequest()
    xhr.open("POST",`${environment.exploreurl}/api/places/view`,false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(entity));

    if (xhr.status === 200) {
      console.log('Request succeeded:', xhr.responseText);
    } else {
      console.error('Request failed:', xhr.statusText);
    }

    // return this.http
    //   .post(
    //     `${environment.exploreurl}/api/places/view`,
    //     JSON.stringify(entity),
    //     { headers: this._sharedHeaders }
    //   )
    //   .pipe(catchError(this.handleError));
  }
}
