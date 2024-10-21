import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioEventoGestComponent } from './calendario-evento-gest.component';

describe('CalendarioEventoGestComponent', () => {
  let component: CalendarioEventoGestComponent;
  let fixture: ComponentFixture<CalendarioEventoGestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarioEventoGestComponent]
    });
    fixture = TestBed.createComponent(CalendarioEventoGestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
