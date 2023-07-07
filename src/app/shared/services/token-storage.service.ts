import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Token } from '../models/users/token.model';
import {
  TOKEN_KEY,
  USER_AVATAR,
  USER_CITY,
  USER_KEY,
  USER_NAME,
} from '../_helpers/constant';
// const TOKEN_KEY = 'auth-token';
// const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  signOut(): void {
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    const user = jwt_decode(token) as Token;

    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);

    this.updateUserInfo(user.avatar, user.name);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public saveCityInfo(city: string): void{
    window.localStorage.removeItem(USER_CITY);
    window.localStorage.setItem(USER_CITY, city);
  }

  public getCityInfo(): string{
    return localStorage.getItem(USER_CITY);
  }

  public getUser(): any {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  public updateUserInfo(avatar: string, name: string): any {
    if (avatar.length != 0) {
      window.localStorage.removeItem(USER_AVATAR);
      window.localStorage.setItem(USER_AVATAR, avatar);
    }
    if (name.length != 0) {
      window.localStorage.removeItem(USER_NAME);
      window.localStorage.setItem(USER_NAME, name);
    }
  }

  public getUserTokenInfo(): Token {
    try {
      const user = jwt_decode(this.getToken()) as Token;
      user.avatar = localStorage.getItem(USER_AVATAR);
      user.name = localStorage.getItem(USER_NAME);
      return user;
    } catch (Error) {
      return null;
    }
  }
}
