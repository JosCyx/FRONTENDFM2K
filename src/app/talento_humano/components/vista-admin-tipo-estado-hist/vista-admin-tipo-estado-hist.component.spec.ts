import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAdminTipoEstadoHistComponent } from './vista-admin-tipo-estado-hist.component';

describe('VistaAdminTipoEstadoHistComponent', () => {
  let component: VistaAdminTipoEstadoHistComponent;
  let fixture: ComponentFixture<VistaAdminTipoEstadoHistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAdminTipoEstadoHistComponent]
    });
    fixture = TestBed.createComponent(VistaAdminTipoEstadoHistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
