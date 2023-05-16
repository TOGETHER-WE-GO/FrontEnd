import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pagination, User } from 'src/app/shared/models';
import { UserService } from 'src/app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-friend',
  templateUrl: './explore-friend.component.html',
  styleUrls: ['./explore-friend.component.scss'],
})
export class ExploreFriendComponent implements OnInit, OnDestroy {
  form: any = {};
  searchKey = '';
  public pageIndex = 1;
  public pageSize = 9;
  public totalRecords: number;
  users: User[];
  blockedPanel = false;
  subscription = new Subscription();
  constructor(private userService: UserService, private router: Router) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  onSubmit() {
    if (this.form['searchKey']) this.searchKey = this.form['searchKey'];
    else this.searchKey = '';

    this.fetchData();
  }

  fetchData() {
    this.subscription.add(
      this.userService
        .searchDiscoveryUser(this.searchKey, this.pageIndex, this.pageSize)
        .subscribe(
          (response: Pagination<User>) => {
            this.users = response.items;
            this.totalRecords = response.total;
            setTimeout(() => {
              this.blockedPanel = false;
            }, 1000);
          },
          (error) => {
            setTimeout(() => {
              this.blockedPanel = false;
            }, 1000);
          }
        )
    );
  }

  pageChanged(event: any) {}

  navigateToProfile(userId: string) {
    this.router.navigate([`/profiles/${userId}`]);
  }
}
