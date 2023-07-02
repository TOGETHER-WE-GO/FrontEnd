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
import { MatTabsModule } from '@angular/material/tabs'; 
import { authInterceptorProviders } from '../shared/interceptors/auth.interceptor';
import { ActiveuserComponent } from './components/activeuser/activeuser.component';
import { ProfileEditComponent } from './profiles/profile-edit/profile-edit.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostsComponent } from './posts/posts.component';
import { NewsfeedDetailComponent } from './home/newsfeed-detail/newsfeed-detail.component';
import { UtcToLocalTimePipe } from '../shared/pipes/utcToLocalTimePipe.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TripPlanComponent } from './trip-plan/trip-plan.component';
import { TripPlanDetailComponent } from './trip-plan/trip-plan-detail/trip-plan-detail.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgFor, AsyncPipe} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { TripPlanFormComponent } from './trip-plan/trip-plan-form/trip-plan-form.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DropdownModule } from 'primeng/dropdown';
// import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { MutualFriendSuggestionComponent } from './home/mutual-friend-suggestion/mutual-friend-suggestion.component';
import { BlockUIModule } from 'ng-block-ui';
import { SameinterestFriendSuggestionComponent } from './home/sameinterest-friend-suggestion/sameinterest-friend-suggestion.component';
@NgModule({
  declarations: [
    ProtectedZoneComponent,
    SidebarComponent,
    ProfilesComponent,
    ProfileFollowsComponent,
    RecommendbarComponent,
    HomeComponent,
    ActiveuserComponent,
    ProfileEditComponent,
    PostsComponent,
    NewsfeedDetailComponent,
    UtcToLocalTimePipe,
    TripPlanComponent,
    TripPlanDetailComponent,
    TripPlanFormComponent,
    MutualFriendSuggestionComponent,
    SameinterestFriendSuggestionComponent
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
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    ImageCropperModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    AsyncPipe,
    CKEditorModule,
    DropdownModule,
    BlockUIModule,
    ProgressSpinnerModule,
    PanelModule,
    BlockUIModule.forRoot()
  ],
  providers:[
    BsModalService,
    authInterceptorProviders
  ]
})
export class ProtectedZoneModule { }
