import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaEventoListComponent } from './alerta-evento-list.component';

describe('AlertaEventoListComponent', () => {
  let component: AlertaEventoListComponent;
  let fixture: ComponentFixture<AlertaEventoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertaEventoListComponent]
    });
    fixture = TestBed.createComponent(AlertaEventoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
