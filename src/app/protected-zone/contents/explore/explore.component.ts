import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlaceService } from 'src/app/shared/services/place.service';
import { PlaceOverall } from '../../../shared/models/index';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit, OnDestroy {
  heroes: PlaceOverall[];
  blockedPanel = false;

  private subscription = new Subscription();

  constructor(private placeService: PlaceService) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.placeService.search('test').subscribe(
        (response: PlaceOverall[]) => {
          this.heroes = response;
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
    // this.heroes = [
    //   {
    //     name: 'test',
    //     image:
    //       'https://www.vietnamonline.com/media/uploads/froala_editor/images/VNO-chua1cot_0nP3Qht.png',
    //     shortDescription:
    //       'Hanoi has long been famed for its rich culture and history. The magnetic combination between timeless values and modern changes makes this city a truly unique capital. Among several symbolic monuments that shape the city’s charm, the One Pillar Pagoda is definitely an exclusive destination, which should always be on your bucket-list as you make your way to Hanoi.',
    //     types: ['tes', 'aaaa'],
    //     rating: 4.5,
    //     tagCount: 12,
    //     viewScore: 123,
    //   },
    //   {
    //     name: 'test',
    //     image:
    //       'https://www.vietnamonline.com/media/uploads/froala_editor/images/VNO-chodongxuan1_VOt3yF6.jpg',
    //     shortDescription:
    //       'Hanoi has long been famed for its rich culture and history. The magnetic combination between timeless values and modern changes makes this city a truly unique capital. Among several symbolic monuments that shape the city’s charm, the One Pillar Pagoda is definitely an exclusive destination, which should always be on your bucket-list as you make your way to Hanoi.',
    //     types: ['tes', 'aaaa'],
    //     rating: 4.5,
    //     tagCount: 12,
    //     viewScore: 123,
    //   },
    // ];
  }

  getCardImage(place: PlaceOverall) {
    if (place.images && place.images.length > 0) {
      return place.images[0];
    } else {
      return '../../../../assets/default.png';
    }
  }
}
