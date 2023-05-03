import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserFollow } from 'src/app/shared/models';
import { UserService } from '../../../shared/services';
@Component({
  selector: 'app-follows',
  templateUrl: './profile-follows.component.html',
  styleUrls: ['./profile-follows.component.scss'],
})
export class ProfileFollowsComponent implements OnInit, OnDestroy {
  public userFollows: UserFollow[];
  public userId: string | null = null;
  public isFollower: number;
  private subscription = new Subscription();

  constructor(private userService: UserService) {}
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

  handleFollow() {}
}
