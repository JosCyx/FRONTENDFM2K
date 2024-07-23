import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudEventoComponent } from './solicitud-evento.component';

describe('SolicitudEventoComponent', () => {
  let component: SolicitudEventoComponent;
  let fixture: ComponentFixture<SolicitudEventoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudEventoComponent]
    });
    fixture = TestBed.createComponent(SolicitudEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
