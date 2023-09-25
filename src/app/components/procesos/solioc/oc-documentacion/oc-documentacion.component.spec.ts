import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OCDocumentacionComponent } from './oc-documentacion.component';

describe('OCDocumentacionComponent', () => {
  let component: OCDocumentacionComponent;
  let fixture: ComponentFixture<OCDocumentacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OCDocumentacionComponent]
    });
    fixture = TestBed.createComponent(OCDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
