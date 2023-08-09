import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllrequestComponent } from './allrequest.component';

describe('AllrequestComponent', () => {
  let component: AllrequestComponent;
  let fixture: ComponentFixture<AllrequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllrequestComponent]
    });
    fixture = TestBed.createComponent(AllrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
