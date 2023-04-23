import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Profile, UserRegistrationDto } from '../models';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserLogin } from '../models/users/user-login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {

  private _sharedHeaders = new HttpHeaders();
  
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set('Content-Type', 'application/json');
  }


  register(formData: UserRegistrationDto) {
    return this.http.post(`${environment.apiUrl}/api/authmanagement/registration`, formData,
        {
            reportProgress: true,
            observe: 'events'
        }).pipe(catchError(this.handleError));
  }

  login(credentials: UserLogin): Observable<any> {
    return this.http.post(`${environment.apiUrl}` + '/api/authmanagement/login', {
      email: credentials.email,
      password: credentials.password
    }, {headers: this._sharedHeaders});
  }
}
