import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  PostService,
  SignalRService,
  TokenStorageService,
  TransmitService,
  UserService,
} from '../../shared/services';
import { FollowRequest, User, UserActivity, TripPlan, Token } from '../../shared/models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProfileFollowsComponent } from './profile-follows/profile-follows.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { Post } from 'src/app/shared/models/posts/post.model';
import { NewsfeedDetailComponent } from '../home/newsfeed-detail/newsfeed-detail.component';
import {
  AcceptFollowRequestEvent,
  FollowRequestEvent,
  RejectFollowRequestEvent,
} from 'src/app/shared/_helpers/constant';
import { TripPlanDetailComponent } from '../trip-plan/trip-plan-detail/trip-plan-detail.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit, OnDestroy {
  public userProfile: User;
  public userActivity: UserActivity;
  public posts: Post[];
  public tripPlans: TripPlan[];
  public loginUserId: string;
  public loginUser: Token;
  public isFollowing: boolean;
  public isReceivingFollowRequest: boolean;
  public isSendingFollowRequest: boolean;
  public bsModalRef: BsModalRef;
  public settingIcon: string =
    'M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6 0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4 1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z';

  private subscription = new Subscription();
  private userId: string;
  options: string[] = ['One', 'Two', 'Three'];
  gridColumns = 4;
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
    private tokenStorageService: TokenStorageService,
    private signalRService: SignalRService,
    private transmitService: TransmitService
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.transmitService.selectedTransmit$.subscribe((value) => {
      if (value != null && value.data != null && value.type == 'profile-update') {
        if (value.data == true) this.blockUI.start();
        else if (value.data == false) this.blockUI.stop();
      }
    });


    this.loginUser = this.tokenStorageService.getUserTokenInfo();
    this.loginUserId = this.loginUser?.nameid;
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.fetchProfileData();
    this.fetchActivityData();
    this.fetchUserPosts();
    this.fetchUserTripPlans();
    this.subscribeSignalEvent();

    this.userService.isChangeProfile$.subscribe((data) => {
      if (data)
        this.subscription.add(
          this.userService
            .getUserProfile(this.userId)
            .subscribe((response: User) => {
              this.userProfile = response;
            })
        );
    });
  }

  subscribeSignalEvent() {
    this.signalRService.notification$.subscribe((event) => {
      if (event.type === 'OnEvent' && event.data) {
        if (event.data.title == FollowRequestEvent) {
          this.isReceivingFollowRequest = true;
        } else if (event.data.title == RejectFollowRequestEvent) {
          this.isSendingFollowRequest = false;
          this.isFollowing = false;
        } else if (event.data.title == AcceptFollowRequestEvent) {
          this.isFollowing = true;
        }
      }
    });
  }

  fetchUserPosts() {
    this.subscription.add(
      this.postService
        .getUserPosts(this.userId)
        .subscribe((response: Post[]) => {
          this.posts = response;
        })
    );
  }

  fetchUserTripPlans() {
    this.subscription.add(
      this.postService
        .getUserTripPlans(this.userId)
        .subscribe((response: TripPlan[]) => {
          this.tripPlans = response;
        })
    );
  }

  fetchActivityData() {
    this.subscription.add(
      this.userService
        .getUserActivity(this.userId)
        .subscribe((response: UserActivity) => {
          this.userActivity = response;
        })
    );
  }

  fetchProfileData() {
    this.subscription.add(
      this.userService
        .getUserProfile(this.userId)
        .subscribe((response: User) => {
          this.userProfile = response;
        })
    );

    this.subscription.add(
      this.userService
        .checkIsFollowing(this.loginUserId, this.userId)
        .subscribe((response: any) => {
          this.isFollowing = response.status;
        })
    );

    this.subscription.add(
      this.userService
        .checkIsReceivingFollowRequest(this.loginUserId, this.userId)
        .subscribe((response: any) => {
          this.isReceivingFollowRequest = response.status;
        })
    );

    this.subscription.add(
      this.userService
        .checkIsSendingFolowRequest(this.loginUserId, this.userId)
        .subscribe((response: any) => {
          this.isSendingFollowRequest = response.status;
        })
    );
  }

  public handelFollowOrRemove(): void {
    if (!(this.isFollowing || this.isSendingFollowRequest)) {
      const followRequest: FollowRequest = {
        sourceId: this.loginUserId,
        targetId: this.userId,
      };

      this.subscription.add(
        this.userService
          .sendFollowRequest(followRequest)
          .subscribe((response: boolean) => {
            this.fetchProfileData();
          })
      );
    } else {
      if (this.isFollowing) {
        this.subscription.add(
          this.userService
            .removeFollow(this.loginUserId, this.userId)
            .subscribe((response: boolean) => {
              this.fetchProfileData();
            })
        );
      } else {
        this.subscription.add(
          this.userService
            .removeFollowRequest(this.loginUserId, this.userId)
            .subscribe((response: boolean) => {
              this.fetchProfileData();
            })
        );
      }
    }
  }

  public handelAcceptOrRejectRequest(type: Number): void {
    if (type == 0) {
      const followRequest: FollowRequest = {
        sourceId: this.userId,
        targetId: this.loginUserId,
      };

      this.subscription.add(
        this.userService
          .acceptFollowRequest(followRequest)
          .subscribe((response: boolean) => {
            this.fetchProfileData();
          })
      );
    } else {
      this.subscription.add(
        this.userService
          .removeFollowRequest(this.userId, this.loginUserId)
          .subscribe((response: boolean) => {
            this.fetchProfileData();
          })
      );
    }
  }

  openModal(isFollower: number) {
    this.bsModalRef = this.modalService.show(ProfileFollowsComponent, {
      class: 'modal-dialog-centered custome-dialog',
      initialState: {
        userId: this.userId,
        loginedUserId: this.loginUserId,
        isFollower: isFollower,
      },
    });
  }

  openEditModal() {
    this.bsModalRef = this.modalService.show(ProfileEditComponent, {
      class: 'modal-dialog modal-lg', 
      initialState: { userId: this.userId, userProfile: this.userProfile },
    });
  }

  public getCardImage(post: Post | TripPlan) {
    if (post.displayImage) {
      return post.displayImage.imageUrl;
    } else {
      return '../../../../assets/default.png';
    }
  }

  onPostClick(item: Post) {
    this.bsModalRef = this.modalService.show(NewsfeedDetailComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState: { postId: item.id, userInfo: this.userProfile, loginUser: this.loginUser },
    });
  }

  onTripPlanClick(item: TripPlan) {
    this.bsModalRef = this.modalService.show(TripPlanDetailComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState: {
        tripPlanId: item.id,
        tripPlanIdentifier: item.propertyIdentifier,
      },
    });
  }
}
