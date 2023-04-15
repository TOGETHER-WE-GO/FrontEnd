import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedZoneComponent } from './protected-zone.component';

describe('ProtectedZoneComponent', () => {
  let component: ProtectedZoneComponent;
  let fixture: ComponentFixture<ProtectedZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtectedZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtectedZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
