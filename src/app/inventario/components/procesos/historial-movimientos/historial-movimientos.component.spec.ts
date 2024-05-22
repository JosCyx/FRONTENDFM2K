import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialMovimientosComponent } from './historial-movimientos.component';

describe('HistorialMovimientosComponent', () => {
  let component: HistorialMovimientosComponent;
  let fixture: ComponentFixture<HistorialMovimientosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialMovimientosComponent]
    });
    fixture = TestBed.createComponent(HistorialMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
