import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserFollow } from 'src/app/shared/models';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  UserService,
  TokenStorageService,
  UINotificationService,
} from '../../../shared/services';
@Component({
  selector: 'app-follows',
  templateUrl: './profile-follows.component.html',
  styleUrls: ['./profile-follows.component.scss'],
})
export class ProfileFollowsComponent implements OnInit, OnDestroy {
  public userFollows: UserFollow[];
  public loginedUserId: string;
  public userId: string | null = null;
  public isFollower: number;
  private subscription = new Subscription();

  constructor(
    private userService: UserService,
    private bsModalRef: BsModalRef,
    private uiNotificationService: UINotificationService
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    if (this.isFollower) {
      this.subscription.add(
        this.userService
          .getUserFollower(this.userId)
          .subscribe((response: UserFollow[]) => {
            this.userFollows = response;
          })
      );
    } else {
      this.subscription.add(
        this.userService
          .getUserFollowing(this.userId)
          .subscribe((response: UserFollow[]) => {
            this.userFollows = response;
          })
      );
    }
  }

  handelRemove(targetUserId: string) {
    this.subscription.add(
      this.userService.removeFollow(this.loginedUserId, targetUserId).subscribe(
        (response: boolean) => {
          if (response) {
            this.uiNotificationService.showSuccess('Remove Successfully');
            this.bsModalRef.hide();
          } else this.uiNotificationService.showSuccess('Remove Failed');
        },
        (error) => {
          this.uiNotificationService.showSuccess('Remove Failed');
        }
      )
    );
  }
}
