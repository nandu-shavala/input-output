import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DurabilityComponent } from './durability.component';

describe('DurabilityComponent', () => {
  let component: DurabilityComponent;
  let fixture: ComponentFixture<DurabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DurabilityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DurabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
