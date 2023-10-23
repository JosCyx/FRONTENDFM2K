import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpPdfComponent } from './sp-pdf.component';

describe('SpPdfComponent', () => {
  let component: SpPdfComponent;
  let fixture: ComponentFixture<SpPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpPdfComponent]
    });
    fixture = TestBed.createComponent(SpPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
