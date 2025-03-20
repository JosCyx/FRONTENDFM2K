import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaListadoMarcacionesComponent } from './vista-listado-marcaciones.component';

describe('VistaListadoMarcacionesComponent', () => {
  let component: VistaListadoMarcacionesComponent;
  let fixture: ComponentFixture<VistaListadoMarcacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaListadoMarcacionesComponent]
    });
    fixture = TestBed.createComponent(VistaListadoMarcacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
