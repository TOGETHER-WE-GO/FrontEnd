import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ContentsRoutingModule } from './contents-routing.module';
import { ExploreComponent } from './explore/explore.component';
import { ExploreDetailComponent } from './explore/explore-detail/explore-detail.component';


@NgModule({
  declarations: [
    ExploreComponent,
    ExploreDetailComponent
  ],
  imports: [
    CommonModule,
    BlockUIModule,
    ProgressSpinnerModule,
    PanelModule,
    ContentsRoutingModule
  ]
})
export class ContentsModule { }
