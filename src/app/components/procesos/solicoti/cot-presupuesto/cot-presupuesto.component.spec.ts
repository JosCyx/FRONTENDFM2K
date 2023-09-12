import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotPresupuestoComponent } from './cot-presupuesto.component';

describe('CotPresupuestoComponent', () => {
  let component: CotPresupuestoComponent;
  let fixture: ComponentFixture<CotPresupuestoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CotPresupuestoComponent]
    });
    fixture = TestBed.createComponent(CotPresupuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
