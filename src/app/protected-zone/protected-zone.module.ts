import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedZoneComponent } from './protected-zone.component';
import { SidebarComponent } from './contents/sidebar/sidebar.component';
import { ProtectedZoneRoutingModule } from './protected-zone-routing.module';


@NgModule({
  declarations: [
    ProtectedZoneComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    ProtectedZoneRoutingModule
  ]
})
export class ProtectedZoneModule { }
