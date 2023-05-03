import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendbarComponent } from './recommendbar.component';

describe('RecommendbarComponent', () => {
  let component: RecommendbarComponent;
  let fixture: ComponentFixture<RecommendbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
