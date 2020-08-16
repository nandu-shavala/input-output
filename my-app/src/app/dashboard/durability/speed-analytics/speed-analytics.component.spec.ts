import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedAnalyticsComponent } from './speed-analytics.component';

describe('SpeedAnalyticsComponent', () => {
  let component: SpeedAnalyticsComponent;
  let fixture: ComponentFixture<SpeedAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
