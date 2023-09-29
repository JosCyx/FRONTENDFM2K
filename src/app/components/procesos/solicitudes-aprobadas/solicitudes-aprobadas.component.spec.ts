import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesAprobadasComponent } from './solicitudes-aprobadas.component';

describe('SolicitudesAprobadasComponent', () => {
  let component: SolicitudesAprobadasComponent;
  let fixture: ComponentFixture<SolicitudesAprobadasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesAprobadasComponent]
    });
    fixture = TestBed.createComponent(SolicitudesAprobadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
