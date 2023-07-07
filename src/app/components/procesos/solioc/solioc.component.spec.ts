import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliocComponent } from './solioc.component';

describe('SoliocComponent', () => {
  let component: SoliocComponent;
  let fixture: ComponentFixture<SoliocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoliocComponent]
    });
    fixture = TestBed.createComponent(SoliocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
