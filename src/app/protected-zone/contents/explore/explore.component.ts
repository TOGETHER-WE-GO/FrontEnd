import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlaceService } from 'src/app/shared/services/place.service';
import { Pagination, PlaceFeatureType, PlaceOverall } from '../../../shared/models/index';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit, OnDestroy {
  // paging
  public pageIndex = 1;
  public pageSize = 9;
  public totalRecords: number;

  places: PlaceOverall[];
  blockedPanel = false;
  form: any = {};

  gridColumns = 4;

  searchKey: string = '';
  searchType: string[];
  placeType: PlaceFeatureType[] 

  private subscription = new Subscription();
  cardData: any;

  constructor(private placeService: PlaceService) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(this.placeService.getPlaceTypes().subscribe((response: PlaceFeatureType[]) =>{
      this.placeType = response;
    }))
    this.fetchData();
  }

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }

  fetchData() {
    this.subscription.add(
      this.placeService
        .search(this.searchKey, this.searchType, this.pageIndex, this.pageSize)
        .subscribe(
          (response: Pagination<PlaceOverall>) => {
            this.places = response.items;
            this.totalRecords = response.total
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

  onSubmit() {
    this.searchType = this.placeType
      .filter(opt => opt.check)
      .map(opt => opt.name);

    if(this.form['searchKey'])
      this.searchKey = this.form['searchKey'];
    else
      this.searchKey = "";

    this.fetchData();
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

  pageChanged(event: any): void {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchData();
  }
}
