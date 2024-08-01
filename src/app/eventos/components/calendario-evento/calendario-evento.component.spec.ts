import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioEventoComponent } from './calendario-evento.component';

describe('CalendarioEventoComponent', () => {
  let component: CalendarioEventoComponent;
  let fixture: ComponentFixture<CalendarioEventoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarioEventoComponent]
    });
    fixture = TestBed.createComponent(CalendarioEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
