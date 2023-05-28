import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/models/posts/post.model';
import {
  PostService,
  SignalRService,
  TokenStorageService,
} from 'src/app/shared/services';
import { NewsfeedDetailComponent } from './newsfeed-detail/newsfeed-detail.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  userInfo: any;
  posts: Post[];
  public bsModalRef: BsModalRef;
  constructor(
    private tokenService: TokenStorageService,
    private postService: PostService,
    private modalService: BsModalService,
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userInfo = this.tokenService.getUserTokenInfo();
    this.fetchData();
  }

  fetchData() {
    this.subscription.add(
      this.postService
        .getUserNewsFeed(this.userInfo.nameid, 0, 10)
        .subscribe((response: Post[]) => {
          this.posts = response;
        })
    );
  }

  onNewsfeedClick(item: Post) {
    this.bsModalRef = this.modalService.show(NewsfeedDetailComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState: { postId: item.id, userInfo: this.userInfo },
    });
  }
}
