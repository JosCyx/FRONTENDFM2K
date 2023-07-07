import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolipagoComponent } from './solipago.component';

describe('SolipagoComponent', () => {
  let component: SolipagoComponent;
  let fixture: ComponentFixture<SolipagoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolipagoComponent]
    });
    fixture = TestBed.createComponent(SolipagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
