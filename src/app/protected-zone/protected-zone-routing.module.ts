import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedZoneComponent } from './protected-zone.component';

const routes: Routes = [
    {
        path: '',
        component: ProtectedZoneComponent,
        children: [
           
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProtectedZoneRoutingModule { }
