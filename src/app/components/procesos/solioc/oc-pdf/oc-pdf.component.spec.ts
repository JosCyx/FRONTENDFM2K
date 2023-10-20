import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcPdfComponent } from './oc-pdf.component';

describe('OcPdfComponent', () => {
  let component: OcPdfComponent;
  let fixture: ComponentFixture<OcPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OcPdfComponent]
    });
    fixture = TestBed.createComponent(OcPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
