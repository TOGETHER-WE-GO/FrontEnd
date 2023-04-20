import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedZoneComponent } from './protected-zone.component';

const routes: Routes = [
  {
    path: '',
    component: ProtectedZoneComponent,
    children: [
      {
        path: 'contents',
        loadChildren: () =>
          import('./contents/contents.module').then((m) => m.ContentsModule),
        data: {
          functionCode: 'DASHBOARD',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedZoneRoutingModule {}
