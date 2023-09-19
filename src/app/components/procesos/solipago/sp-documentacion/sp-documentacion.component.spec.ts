import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SPDocumentacionComponent } from './sp-documentacion.component';

describe('SPDocumentacionComponent', () => {
  let component: SPDocumentacionComponent;
  let fixture: ComponentFixture<SPDocumentacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SPDocumentacionComponent]
    });
    fixture = TestBed.createComponent(SPDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
