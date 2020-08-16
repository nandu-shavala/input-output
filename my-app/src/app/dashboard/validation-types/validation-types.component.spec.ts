import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationTypesComponent } from './validation-types.component';

describe('ValidationTypesComponent', () => {
  let component: ValidationTypesComponent;
  let fixture: ComponentFixture<ValidationTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
