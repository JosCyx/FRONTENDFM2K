import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaEventoComponent } from './alerta-evento.component';

describe('AlertaEventoComponent', () => {
  let component: AlertaEventoComponent;
  let fixture: ComponentFixture<AlertaEventoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertaEventoComponent]
    });
    fixture = TestBed.createComponent(AlertaEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
