import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/models/posts/post.model';
import {
  PostService,
  SignalRService,
  TokenStorageService,
  TransmitService,
} from 'src/app/shared/services';
import { NewsfeedDetailComponent } from './newsfeed-detail/newsfeed-detail.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Likes } from 'src/app/shared/models/posts/like.model';
import { Token } from 'src/app/shared/models';
import { LikeCreate } from 'src/app/shared/models/posts/like-create.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  userInfo: Token;
  city: string;
  posts: Post[];
  public bsModalRef: BsModalRef;
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(
    private tokenService: TokenStorageService,
    private postService: PostService,
    private modalService: BsModalService,
    private transmitService: TransmitService
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.transmitService.selectedTransmit$.subscribe((value) => {
      if (value != null && value.data != null && value.type == 'post-create' || value.type == 'trip-create') {
        if (value.data == true) this.blockUI.start();
        else if (value.data == false) this.blockUI.stop();
      }
    });

    this.userInfo = this.tokenService.getUserTokenInfo();
    this.city = this.tokenService.getCityInfo();
    this.fetchData();
  }


  // Method to handle the scroll event
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    // Implement the logic to determine if the user has scrolled to the bottom
    if (this.isScrolledToBottom()) {
      // Call the API
      this.callApi();
    }
  }

  isScrolledToBottom(): boolean {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    return windowBottom >= docHeight;
  }

  // Function to call the API
  callApi(): void {
    this.subscription.add(
      this.postService
        .getUserNewsFeed(this.userInfo.nameid, 0, 2)
        .subscribe((response: Post[]) => {
          this.posts.push(...response);
        })
    );
  }

  fetchData() {
    this.subscription.add(
      this.postService
        .getUserNewsFeed(this.userInfo.nameid, 0, 2)
        .subscribe((response: Post[]) => {
          this.posts = response;
        })
    );
  }

  getTotalComments(item: Post)
  {
    var total = 0;
    item.comments.forEach(element => {
      total += element.replies.length;
      total += 1;
    });
    return total;
  }

  checkLikeStatus(likes: Likes[]) {
    const userLike = likes.find((obj) => {
      return obj.userId === this.userInfo.nameid;
    });

    if (userLike !== undefined) return true;
    return false;
  }

  createLike(postId: string, index: number) {
    const like: LikeCreate = {
      userId: this.userInfo.nameid,
      userAvatar: this.userInfo.avatar,
      userName: this.userInfo.name,
      postId: postId,
    };

    this.subscription.add(
      this.postService.createLike(postId, like).subscribe((response: Likes) => {
        this.posts[index].likes.unshift(response);
      })
    );
  }

  removeLike(postId: string, likes: Likes[], index: number) {
    const userLike = likes.find((obj) => {
      return obj.userId === this.userInfo.nameid;
    });

    if (userLike !== undefined) {
      const likeIndex = likes.findIndex(x => x.id == userLike.id);
      this.subscription.add(
        this.postService
          .deleteLike(postId, userLike.id)
          .subscribe((response: boolean) => {
            if (response) this.posts[index].likes.splice(likeIndex, 1);
          })
      );
    }
  }

  onNewsfeedClick(item: Post) {
    this.bsModalRef = this.modalService.show(NewsfeedDetailComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState: { postId: item.id, loginUser: this.userInfo },
    });
  }
}
