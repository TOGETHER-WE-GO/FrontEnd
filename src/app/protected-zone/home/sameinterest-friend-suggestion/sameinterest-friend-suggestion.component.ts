import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FollowMutualRecommend, Token } from 'src/app/shared/models';
import { RecommendationService } from 'src/app/shared/services';

@Component({
  selector: 'app-sameinterest-friend-suggestion',
  templateUrl: './sameinterest-friend-suggestion.component.html',
  styleUrls: ['./sameinterest-friend-suggestion.component.scss']
})
export class SameinterestFriendSuggestionComponent implements OnInit, OnDestroy {
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
        .recommendFollowBySameInterest(this.userInfo.nameid)
        .subscribe((response: FollowMutualRecommend[]) => {
          this.followMutuals = response;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
