import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PlaceOverall } from 'src/app/shared/models';
import {
  RecommendationService,
  TokenStorageService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-recommendbar',
  templateUrl: './recommendbar.component.html',
  styleUrls: ['./recommendbar.component.scss'],
})
export class RecommendbarComponent implements OnInit, OnDestroy {
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
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };

  @Input() reloadEvent: boolean;

  private subscription = new Subscription();
  loginUserId: string;
  suggestedPlace: PlaceOverall[];

  constructor(
    private recommendationService: RecommendationService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loginUserId = this.tokenStorageService.getUserTokenInfo()?.nameid;
    this.fetchData();
  }

  ngOnChanges() {
    this.fetchData();
  }

  fetchData() {
    this.subscription.add(
      this.recommendationService
        .recommendPlacesForUser(this.loginUserId)
        .subscribe((response: PlaceOverall[]) => {
          this.suggestedPlace = response;
        })
    );
  }

  getCardImage(place: PlaceOverall) {
    if (place.images && place.images.length > 0) {
      return place.images[0];
    } else {
      return '../../../../assets/default.png';
    }
  }

  checkPlaceType(place: PlaceOverall) {
    var isPresent = place.types.some(function (el) {
      return el.name === 'Restaurant' || el.name === 'Resort & Hotel';
    });
    return isPresent;
  }
}
