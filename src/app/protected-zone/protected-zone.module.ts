import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedZoneComponent } from './protected-zone.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProtectedZoneRoutingModule } from './protected-zone-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProfilesComponent } from './profiles/profiles.component';
import { ProfileFollowsComponent } from './profiles/profile-follows/profile-follows.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { RecommendbarComponent } from './components/recommendbar/recommendbar.component';
import { HomeComponent } from './home/home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {MatCardModule} from '@angular/material/card';
@NgModule({
  declarations: [
    ProtectedZoneComponent,
    SidebarComponent,
    ProfilesComponent,
    ProfileFollowsComponent,
    RecommendbarComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    ProtectedZoneRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    ModalModule.forRoot(),
    CarouselModule,
    MatCardModule
  ],
  providers:[
    BsModalService
  ]
})
export class ProtectedZoneModule { }
