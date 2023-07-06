import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionesComponent } from './transacciones.component';

describe('TransaccionesComponent', () => {
  let component: TransaccionesComponent;
  let fixture: ComponentFixture<TransaccionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransaccionesComponent]
    });
    fixture = TestBed.createComponent(TransaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
