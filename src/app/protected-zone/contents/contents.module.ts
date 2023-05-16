import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ContentsRoutingModule } from './contents-routing.module';
import { ExploreComponent } from './explore/explore.component';
import { ExploreDetailComponent } from './explore/explore-detail/explore-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatCardModule} from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgbRatingModule} from '@ng-bootstrap/ng-bootstrap';
import { ExploreFriendComponent } from './explore-friend/explore-friend.component'; 

@NgModule({
  declarations: [
    ExploreComponent,
    ExploreDetailComponent,
    ExploreFriendComponent
  ],
  imports: [
    CommonModule,
    BlockUIModule,
    ProgressSpinnerModule,
    PanelModule,
    NgxPaginationModule,
    ContentsRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    FlexLayoutModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    NgbRatingModule
  ]
})
export class ContentsModule { }
