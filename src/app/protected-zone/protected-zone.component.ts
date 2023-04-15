import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-protected-zone',
  templateUrl: './protected-zone.component.html',
  styleUrls: ['./protected-zone.component.scss'],
})
export class ProtectedZoneComponent implements OnInit {

  collapedSideBar!: boolean;

  constructor() {}

  ngOnInit(): void {}

  receiveCollapsed($event: any) {
    this.collapedSideBar = $event;
  }
}
