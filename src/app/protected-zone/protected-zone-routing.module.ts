import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { ProtectedZoneComponent } from './protected-zone.component';
import { TripPlanComponent } from './trip-plan/trip-plan.component';

const routes: Routes = [
  {
    path: '',
    component: ProtectedZoneComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        // data: {
        //     functionCode: 'CONTENT_KNOWLEDGEBASE'
        // },
        // canActivate: [AuthGuard]
      },
      {
        path: 'contents',
        loadChildren: () =>
          import('./contents/contents.module').then((m) => m.ContentsModule),
        data: {
          functionCode: 'DASHBOARD',
        },
      },
      {
        path: 'profiles/:id',
        component: ProfilesComponent,
        // data: {
        //     functionCode: 'CONTENT_KNOWLEDGEBASE'
        // },
        // canActivate: [AuthGuard]
      },
      {
        path: 'trip-plan',
        component: TripPlanComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedZoneRoutingModule {}
