import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaListadoAusentismosComponent } from './vista-listado-ausentismos.component';

describe('VistaListadoAusentismosComponent', () => {
  let component: VistaListadoAusentismosComponent;
  let fixture: ComponentFixture<VistaListadoAusentismosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaListadoAusentismosComponent]
    });
    fixture = TestBed.createComponent(VistaListadoAusentismosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
