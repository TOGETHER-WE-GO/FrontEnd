import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { BaseService } from './base.service';
import {
  CommentCreate,
  PostCreate,
  Comments,
  ReplyCreate,
  Reply,
  TripPlan,
  TripPlanCreate,
} from '../models';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post } from '../models/posts/post.model';
import { LikeCreate } from '../models/posts/like-create.model';
import { Likes } from '../models/posts/like.model';

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
      .post<string>(`${environment.postUrl}/api/posts`, data);
  }

  searchTripPlan(city: string, startDate: Date, endDate: Date) {
    let params = new HttpParams().set('city', city).set('startDate', startDate.toString()).set('endDate', endDate.toString());

    return this.http
      .get<TripPlan[]>(`${environment.postUrl}/api/tripplans/search`, {
        headers: this._sharedHeaders,
        params,
      })
      .pipe(
        map((response: TripPlan[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getUserTripPlans(userId: string) {
    return this.http
      .get<TripPlan[]>(`${environment.postUrl}/api/tripplans/users/${userId}`, {
        headers: this._sharedHeaders
      })
      .pipe(
        map((response: TripPlan[]) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getTripPlanDetail(tripPlanId: string)
  {
    return this.http
      .get<TripPlan>(`${environment.postUrl}/api/tripplans/${tripPlanId}`, {
        headers: this._sharedHeaders
      })
      .pipe(
        map((response: TripPlan) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  createTripPlan(data: TripPlanCreate) {
    return this.http
      .post(`${environment.postUrl}/api/tripplans`, data, {
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

  getUserPosts(userId: string, fromUserId: string) {
    let params = new HttpParams().set('fromUserId', fromUserId);
    return this.http
      .get<Post[]>(`${environment.postUrl}/api/posts/users/${userId}`, {
        headers: this._sharedHeaders,
        params: params
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

  createLike(postId: string, data: LikeCreate) {
    return this.http
      .post<Likes>(
        `${environment.postUrl}/api/posts/${postId}/likes`,
        data
      )
      .pipe(
        map((response: Likes) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  deleteLike(postId: string, likeId: string) {
    return this.http
      .delete<boolean>(
        `${environment.postUrl}/api/posts/${postId}/likes/${likeId}`,
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
