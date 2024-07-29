import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialEventoComponent } from './historial-evento.component';

describe('HistorialEventoComponent', () => {
  let component: HistorialEventoComponent;
  let fixture: ComponentFixture<HistorialEventoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialEventoComponent]
    });
    fixture = TestBed.createComponent(HistorialEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
