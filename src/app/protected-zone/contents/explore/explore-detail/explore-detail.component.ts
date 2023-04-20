import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlaceDetail } from 'src/app/shared/models/places/place-detail';
import { PlaceService } from 'src/app/shared/services/place.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeTrackingService } from 'src/app/shared/services';
import { Rating } from 'src/app/shared/models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-explore-detail',
  templateUrl: './explore-detail.component.html',
  styleUrls: ['./explore-detail.component.scss'],
})
export class ExploreDetailComponent implements OnInit, OnDestroy {
  placeDetail: PlaceDetail;
  placeDetailId: number;
  blockedPanel = false;

  private subscription = new Subscription();

  constructor(
    private placeService: PlaceService,
    private activatedRoute: ActivatedRoute,
    private timeTrackingService: TimeTrackingService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    this.timeTrackingService.stopTracking();

    let entity: Rating = {
      userId: 3,
      placeId: this.placeDetail.id,
      score: this.timeTrackingService.getTimeSpent(),
    };

    this.updateUserRating(entity);

    this.subscription.unsubscribe();
  }

  Test(){
    let entity: Rating = {
      userId: 3,
      placeId: this.placeDetail.id,
      score: this.timeTrackingService.getTimeSpent(),
    };

    this.updateUserRating(entity);
  }

  updateUserRating(entity: Rating) {
    // let xhr = new XMLHttpRequest()
    // xhr.open("POST",`${environment.exploreurl}/api/places/view`,false);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify(entity));

    // if (xhr.status === 200) {
    //   console.log('Request succeeded:', xhr.responseText);
    // } else {
    //   console.error('Request failed:', xhr.statusText);
    // }
    let url = `${environment.exploreurl}/api/places/view`
    const blob = new Blob([JSON.stringify(entity)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      const success = navigator.sendBeacon(url, blob);
      if (!success) {
        console.error('Beacon transmission failed.');
      }
    } else {
      console.error('sendBeacon is not supported in this browser.');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.timeTrackingService.startTracking();

    this.placeDetailId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
    this.subscription.add(
      this.placeService.getPlaceDetail(this.placeDetailId).subscribe(
        (response: PlaceDetail) => {
          this.placeDetail = response;
        },
        (error) => {}
      )
    );
  }
}
