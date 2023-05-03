import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenStorageService, UserService } from '../../shared/services';
import { FollowRequest, User, UserActivity } from '../../shared/models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProfileFollowsComponent } from './profile-follows/profile-follows.component';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit, OnDestroy {
  public userProfile: User;
  public userActivity: UserActivity;
  public loginUserId: string;
  public isFollowing: boolean;
  public bsModalRef: BsModalRef;
  public settingIcon: string =
    'M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6 0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4 1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z';

  private subscription = new Subscription();
  private userId: string;

  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenStorageService: TokenStorageService
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loginUserId = this.tokenStorageService.getUserTokenInfo()?.nameid;
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');

    this.fetchData();
  }

  fetchData() {
    this.subscription.add(
      this.userService
        .getUserProfile(this.userId)
        .subscribe((response: User) => {
          this.userProfile = response;
        })
    );

    this.subscription.add(
      this.userService
        .getUserActivity(this.userId)
        .subscribe((response: UserActivity) => {
          this.userActivity = response;
        })
    );

    this.subscription.add(
      this.userService
        .checkIsFollowing(this.loginUserId, this.userId)
        .subscribe((response: boolean) => {
          this.isFollowing = response;
        })
    );
  }

  public handleEditProfile(): void {
    alert('This feature is not available right now!');
  }

  public handelFollowAndRemove(): void {
    if (this.isFollowing) {
    } else {
      const followRequest: FollowRequest = {
        senderId: this.loginUserId,
        receiverId: this.userId,
      };
      this.subscription.add(
        this.userService
          .sendFollowRequest(followRequest)
          .subscribe((response: boolean) => {
            console.log('oke');
          })
      );
    }
  }

  openModal(isFollower: number) {
    this.bsModalRef = this.modalService.show(ProfileFollowsComponent, {
      class: 'modal-dialog-centered custome-dialog',
      initialState: { userId: this.userId, isFollower: isFollower },
    });
  }
}
