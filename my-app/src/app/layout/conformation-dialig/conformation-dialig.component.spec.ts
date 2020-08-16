import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformationDialigComponent } from './conformation-dialig.component';

describe('ConformationDialigComponent', () => {
  let component: ConformationDialigComponent;
  let fixture: ComponentFixture<ConformationDialigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConformationDialigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformationDialigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
