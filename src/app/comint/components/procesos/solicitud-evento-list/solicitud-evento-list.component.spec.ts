import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudEventoListComponent } from './solicitud-evento-list.component';

describe('SolicitudEventoListComponent', () => {
  let component: SolicitudEventoListComponent;
  let fixture: ComponentFixture<SolicitudEventoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudEventoListComponent]
    });
    fixture = TestBed.createComponent(SolicitudEventoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
