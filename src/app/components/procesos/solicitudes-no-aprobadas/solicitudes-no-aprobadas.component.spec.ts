import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesNoAprobadasComponent } from './solicitudes-no-aprobadas.component';

describe('SolicitudesNoAprobadasComponent', () => {
  let component: SolicitudesNoAprobadasComponent;
  let fixture: ComponentFixture<SolicitudesNoAprobadasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesNoAprobadasComponent]
    });
    fixture = TestBed.createComponent(SolicitudesNoAprobadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
