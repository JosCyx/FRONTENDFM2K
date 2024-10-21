import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEventoGestComponent } from './formulario-evento-gest.component';

describe('FormularioEventoGestComponent', () => {
  let component: FormularioEventoGestComponent;
  let fixture: ComponentFixture<FormularioEventoGestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioEventoGestComponent]
    });
    fixture = TestBed.createComponent(FormularioEventoGestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
