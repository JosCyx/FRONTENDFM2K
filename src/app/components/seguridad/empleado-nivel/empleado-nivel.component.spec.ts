import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoNivelComponent } from './empleado-nivel.component';

describe('EmpleadoNivelComponent', () => {
  let component: EmpleadoNivelComponent;
  let fixture: ComponentFixture<EmpleadoNivelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpleadoNivelComponent]
    });
    fixture = TestBed.createComponent(EmpleadoNivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
