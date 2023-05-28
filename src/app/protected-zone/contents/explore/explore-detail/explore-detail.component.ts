import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { concatMap, Subscription, switchMap } from 'rxjs';
import { PlaceDetail } from 'src/app/shared/models/places/place-detail';
import { PlaceService } from 'src/app/shared/services/place.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  TimeTrackingService,
  RecommendationService,
  TokenStorageService,
  UserService,
} from 'src/app/shared/services';
import {
  PlaceOverall,
  UpdateUserInteraction,
  UserPlaceInteraction,
} from 'src/app/shared/models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-explore-detail',
  templateUrl: './explore-detail.component.html',
  styleUrls: ['./explore-detail.component.scss'],
})
export class ExploreDetailComponent implements OnInit, OnDestroy {
  placeDetail: PlaceDetail;
  placeRecommend: PlaceOverall[];
  placeRecommendNearby: PlaceOverall[];
  placeDetailId: number;
  blockedPanel = false;
  isRestaurant = true;
  placeTypes: string[];
  review: number;
  loginUserId: string;

  // carousel config
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
        items: 3,
      },
      400: {
        items: 3,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };

  private subscription = new Subscription();

  constructor(
    private placeService: PlaceService,
    private userService: UserService,
    private recommendService: RecommendationService,
    private activatedRoute: ActivatedRoute,
    private timeTrackingService: TimeTrackingService,
    private tokenStorageService: TokenStorageService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    this.stopTrackingUser();
  }

  ngOnDestroy(): void {
    this.stopTrackingUser();
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((val) => {
      this.stopTrackingUser();
      this.initPage();
    });
  }

  private initPage() {
    this.startTrackingUser();
    this.loginUserId = this.tokenStorageService.getUserTokenInfo()?.nameid;

    this.placeDetailId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );

    this.subscription.add(
      this.userService
        .getUserPlaceInteraction(this.loginUserId, this.placeDetailId)
        .subscribe((response: UserPlaceInteraction) => {
          this.review = response.rating;
        })
    );

    this.subscription.add(
      this.placeService
        .getPlaceDetail(this.placeDetailId)
        .pipe(
          switchMap((data1) => {
            this.placeDetail = data1;
            this.placeTypes = data1.types.map((x) => x.name);
            return this.recommendService.recommendPlaceByContent(
              this.placeDetailId,
              this.placeTypes
            );
          })
        )
        .subscribe((data2) => {
          this.placeRecommend = data2;
        })
    );

    this.subscription.add(
      this.recommendService
        .recommendPlaceNearby(this.placeDetailId, 30)
        .subscribe((response: PlaceOverall[]) => {
          this.placeRecommendNearby = response;
        })
    );
  }

  private startTrackingUser() {
    this.timeTrackingService.startTracking();
    this.timeTrackingService.isRunning = true;
  }

  private stopTrackingUser() {
    if (
      this.timeTrackingService &&
      this.timeTrackingService.intervalSubscription &&
      this.timeTrackingService.isRunning
    ) {
      this.timeTrackingService.stopTracking();

      if (this.timeTrackingService.getTimeSpent() > 0) {
        let entity: UpdateUserInteraction = {
          userId: this.loginUserId,
          placeId: this.placeDetail.id,
          score: this.timeTrackingService.getTimeSpent(),
        };
        this.userService.updateUserView(entity);
        this.timeTrackingService.resetTimeSpent();
        this.timeTrackingService.isRunning = false;
      }
    }
  }

  onRateChange(event: number) {
    this.review = event;
    this.subscription.add(
      this.userService
        .createRating(this.loginUserId, this.placeDetailId, this.review)
        .subscribe()
    );
  }

  getCardImage(place: PlaceOverall | PlaceDetail) {
    if (place.images && place.images.length > 0) {
      return place.images[0];
    } else {
      return '../../../../assets/default.png';
    }
  }

  checkPlaceType(place: PlaceOverall | PlaceDetail) {
    var isPresent = place.types.some(function (el) {
      return el.name === 'Restaurant' || el.name === 'Resort & Hotel';
    });
    return isPresent;
  }
}
