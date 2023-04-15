import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject, catchError } from 'rxjs';
import { BaseService } from './base.service';
import { Profile, UserRegistrationDto } from '../models';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private manager = new UserManager(getClientSettings());
  private user: User | null;

  private _sharedHeaders = new HttpHeaders();
  
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set('Content-Type', 'application/json');

    this.manager.getUser().then((user) => {
      this.user = user;
      this._authNavStatusSource.next(this.isAuthenticated());
    });
  }

  login() {
    return this.manager.signinRedirect();
  }

  register(formData: UserRegistrationDto) {
    return this.http.post(`${environment.apiUrl}/api/accounts/registration`, formData,
        {
            reportProgress: true,
            observe: 'events'
        }).pipe(catchError(this.handleError));
}

  async completeAuthentication() {
    this.user = await this.manager.signinRedirectCallback();
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  get authorizationHeaderValue(): string {
    if (this.user) {
      return `${this.user.token_type} ${this.user.access_token}`;
    }
    return null;
  }

  get name(): string {
    return this.user != null ? this.user.profile.name : '';
  }

  // get profile(): Profile {
  //   return this.user != null ? this.user.profile : null;
  // }
  async signout() {
    await this.manager.signoutRedirect();
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.authorityUrl,
    client_id: environment.clientId,
    redirect_uri: environment.clientUrl + '/auth-callback',
    post_logout_redirect_uri: environment.clientUrl,
    response_type: 'id_token token',
    scope: environment.scope,
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: environment.clientUrl + '/silent-refresh.html',
  };
}
