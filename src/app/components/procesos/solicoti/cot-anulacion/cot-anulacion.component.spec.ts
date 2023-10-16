import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotAnulacionComponent } from './cot-anulacion.component';

describe('CotAnulacionComponent', () => {
  let component: CotAnulacionComponent;
  let fixture: ComponentFixture<CotAnulacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CotAnulacionComponent]
    });
    fixture = TestBed.createComponent(CotAnulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
