import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAdminEstadoProcesoComponent } from './vista-admin-estado-proceso.component';

describe('VistaAdminEstadoProcesoComponent', () => {
  let component: VistaAdminEstadoProcesoComponent;
  let fixture: ComponentFixture<VistaAdminEstadoProcesoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAdminEstadoProcesoComponent]
    });
    fixture = TestBed.createComponent(VistaAdminEstadoProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
