import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreDetailComponent } from './explore/explore-detail/explore-detail.component';
import { ExploreComponent } from './explore/explore.component';

const routes: Routes = [
    {
        path: 'explores',
        component: ExploreComponent
    },
    {
        path: 'explores-detail/:id',
        component: ExploreDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContentsRoutingModule {}
