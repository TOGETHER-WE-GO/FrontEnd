import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { BaseService } from './base.service';
import {
  CommentCreate,
  PostCreate,
  Comments,
  ReplyCreate,
  Reply,
} from '../models';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserLogin } from '../models/users/user-login.model';
import { Post } from '../models/posts/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService extends BaseService {
  private _sharedHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set(
      'Content-Type',
      'application/json'
    );
  }

  createPost(data: PostCreate) {
    return this.http
      .post(`${environment.postUrl}/api/posts`, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.handleError));
  }

  uploadImage(file: Blob) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${environment.postUrl}/api/posts/images`,
      formData
    );
  }

  getPostDetail(postId: string) {
    return this.http
      .get<Post>(`${environment.postUrl}/api/posts/${postId}`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map((response: Post) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getUserPosts(userId: string) {
    return this.http
      .get<Post[]>(`${environment.postUrl}/api/posts/users/${userId}`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map((response: Post[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getUserNewsFeed(userId: string, skip: number, take: number) {
    let params = new HttpParams().set('skip', skip).set('take', take);

    return this.http
      .get<Post[]>(`${environment.postUrl}/api/posts/newsfeed/${userId}`, {
        headers: this._sharedHeaders,
        params,
      })
      .pipe(
        map((response: Post[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  createComment(postId: string, data: CommentCreate) {
    return this.http
      .post<Comments>(
        `${environment.postUrl}/api/posts/${postId}/comments`,
        data
      )
      .pipe(
        map((response: Comments) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getComment(postId: string) {
    return this.http
      .get<Comments[]>(`${environment.postUrl}/api/posts/${postId}/comments`, {
        headers: this._sharedHeaders,
      })
      .pipe(
        map((response: Comments[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  deleteComment(postId: string, commentId: string) {
    return this.http
      .delete<boolean>(
        `${environment.postUrl}/api/posts/${postId}/comments/${commentId}`,
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

  createReply(postId: string, commentId: string, data: ReplyCreate) {
    return this.http
      .post<Reply>(
        `${environment.postUrl}/api/posts/${postId}/comments/${commentId}/replies`,
        data
      )
      .pipe(
        map((response: Reply) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  deleteReply(postId: string, commentId: string, replyId: string) {
    return this.http
      .delete<boolean>(
        `${environment.postUrl}/api/posts/${postId}/comments/${commentId}/replies/${replyId}`,
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
}
