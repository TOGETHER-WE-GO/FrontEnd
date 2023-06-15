import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FollowMutualRecommend, Token } from 'src/app/shared/models';
import { RecommendationService } from 'src/app/shared/services';

@Component({
  selector: 'app-mutual-friend-suggestion',
  templateUrl: './mutual-friend-suggestion.component.html',
  styleUrls: ['./mutual-friend-suggestion.component.scss'],
})
export class MutualFriendSuggestionComponent implements OnInit, OnDestroy {
  @Input() userInfo: Token = {} as Token;
  followMutuals: FollowMutualRecommend[] = [{}] as FollowMutualRecommend[] ;
  private subscription = new Subscription();
  constructor(private recommendService: RecommendationService) {}

  ngOnInit(): void {
    this.fetchMutualFollowSuggestion();
  }

  fetchMutualFollowSuggestion() {
    this.subscription.add(
      this.recommendService
        .recommendFollowByMutualFollowing(this.userInfo.nameid)
        .subscribe((response: FollowMutualRecommend[]) => {
          this.followMutuals = response;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
