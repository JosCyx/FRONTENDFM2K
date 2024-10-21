import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoGestionComponent } from './evento-gestion.component';

describe('EventoGestionComponent', () => {
  let component: EventoGestionComponent;
  let fixture: ComponentFixture<EventoGestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventoGestionComponent]
    });
    fixture = TestBed.createComponent(EventoGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
