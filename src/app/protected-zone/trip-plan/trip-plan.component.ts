import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Token,
  PlaceFeatureType,
  TripPlan
} from 'src/app/shared/models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TokenStorageService, PlaceService, PostService } from '../../shared/services';
import { TripPlanDetailComponent } from './trip-plan-detail/trip-plan-detail.component';
@Component({
  selector: 'app-trip-plan',
  templateUrl: './trip-plan.component.html',
  styleUrls: ['./trip-plan.component.scss'],
})
export class TripPlanComponent implements OnInit, OnDestroy {
  alignMessage = 'chat-message-right';
  user: Token;
  locations: PlaceFeatureType[] = [];
  tripPlans: TripPlan[];
  public bsModalRef: BsModalRef;

  private subscription = new Subscription();

  @ViewChild('sendMessage') sendMessage: ElementRef;
  constructor(
    private tokenService: TokenStorageService,
    private placeService: PlaceService,
    private modalService: BsModalService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.user = this.tokenService.getUserTokenInfo();
    this.subscription.add(
      this.placeService
        .getPlaceLocation()
        .subscribe((response: PlaceFeatureType[]) => {
          this.locations = response;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(contactForm: any) {
    console.log(contactForm)
    if(contactForm.value['city'] && contactForm.value['startDate'] && contactForm.value['endDate'])
    this.subscription.add(this.postService.searchTripPlan(contactForm.value['city'], contactForm.value['startDate'], contactForm.value['endDate']).subscribe((response: TripPlan[]) =>{
      this.tripPlans = response;
    }));
  }

  onTripPlanClick(item: TripPlan) {
    this.bsModalRef = this.modalService.show(TripPlanDetailComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState: { tripPlanId: item.id, tripPlanIdentifier: item.propertyIdentifier },
    });
  }
}
