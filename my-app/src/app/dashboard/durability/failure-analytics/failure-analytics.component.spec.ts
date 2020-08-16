import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureAnalyticsComponent } from './failure-analytics.component';

describe('FailureAnalyticsComponent', () => {
  let component: FailureAnalyticsComponent;
  let fixture: ComponentFixture<FailureAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailureAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
