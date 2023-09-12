import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotDocumentacionComponent } from './cot-documentacion.component';

describe('CotDocumentacionComponent', () => {
  let component: CotDocumentacionComponent;
  let fixture: ComponentFixture<CotDocumentacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CotDocumentacionComponent]
    });
    fixture = TestBed.createComponent(CotDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
