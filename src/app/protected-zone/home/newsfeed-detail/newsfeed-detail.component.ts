import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import {
  CommentCreate,
  Comments,
  Reply,
  ReplyCreate,
} from 'src/app/shared/models';
import { Post } from 'src/app/shared/models/posts/post.model';
import { PostService, TokenStorageService } from 'src/app/shared/services';

@Component({
  selector: 'app-newsfeed-detail',
  templateUrl: './newsfeed-detail.component.html',
  styleUrls: ['./newsfeed-detail.component.scss'],
})
export class NewsfeedDetailComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  userInfo: any;
  postId: string;
  post: Post = new Post();
  comments: Comments[] = [];
  replyInputs: string[] = [];
  replyAction: boolean[] = [];
  activePanel: number | null = null;

  customOptions: any = {
    loop: false,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 8,
      },
      400: {
        items: 8,
      },
      740: {
        items: 8,
      },
      940: {
        items: 8,
      },
    },
    nav: true,
  };

  @ViewChild('textAreaComment') textAreaComment: ElementRef;
  @ViewChild('acbtn') acbtn: ElementRef;
  constructor(
    public router: Router,
    private tokenService: TokenStorageService,
    private postService: PostService,
    public bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }
  togglePanel(id: number) {
    this.activePanel = this.activePanel !== id ? id : null;
  }

  isPanelActive(id: number) {
    return this.activePanel === id;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchData() {
    this.subscription.add(
      this.postService
        .getPostDetail(this.postId)
        .subscribe((response: Post) => {
          this.post = response;
        })
    );

    this.subscription.add(
      this.postService
        .getComment(this.postId)
        .subscribe((response: Comments[]) => {
          this.comments = response;
        })
    );
  }

  onWriteComment() {
    const commentMessage = this.textAreaComment.nativeElement.value as string;
    if (commentMessage && commentMessage.trim().length != 0) {
      const commentCreate: CommentCreate = {
        postId: this.postId,
        message: commentMessage,
        userId: this.userInfo.nameid?? this.userInfo.id ,
        userName: this.userInfo.name?? this.userInfo.userName,
        userAvatar: this.userInfo.avatar,
      };

      this.subscription.add(
        this.postService
          .createComment(this.postId, commentCreate)
          .subscribe((response: Comments) => {
            this.comments.unshift(response);
          })
      );
    }
  }

  onReplyClick(index: number) {
    this.replyAction[index] = true;
  }

  onRemoveCommentClick(index: number, item: Comments) {
    this.subscription.add(
      this.postService
        .deleteComment(this.postId, item.id)
        .subscribe((response: boolean) => {
          if (response) this.comments.splice(index, 1);
        })
    );
  }

  onSaveReply(index: number, comment: Comments) {
    const replyMessage = this.replyInputs[index];
    if (replyMessage && replyMessage.trim().length != 0) {
      const ReplyCreate: ReplyCreate = {
        postId: this.postId,
        commentId: comment.id,
        message: replyMessage,
        userId: this.userInfo.nameid?? this.userInfo.id ,
        userName: this.userInfo.name?? this.userInfo.userName ,
        userAvatar: this.userInfo.avatar,
      };

      this.subscription.add(
        this.postService
          .createReply(this.postId, comment.id, ReplyCreate)
          .subscribe((response: Reply) => {
            this.comments[index].replies.unshift(response);
            this.replyAction[index] = false;
          })
      );
    }
  }

  onRemoveReplyClick(index: number, reply: Reply, comment: Comments) {
    this.subscription.add(
      this.postService
        .deleteReply(this.postId, comment.id, reply.id)
        .subscribe((response: boolean) => {
          if (response) comment.replies.splice(index, 1);
        })
    );
  }

  onUserNameClick(userId: string) {
    this.bsModalRef.hide();
    this.router.navigate([`profiles/${userId}`]);
  }

  onCancel(index: number) {
    this.replyAction[index] = false;
  }
}
