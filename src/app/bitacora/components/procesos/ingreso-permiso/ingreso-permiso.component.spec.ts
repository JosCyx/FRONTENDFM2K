import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoPermisoComponent } from './ingreso-permiso.component';

describe('IngresoPermisoComponent', () => {
  let component: IngresoPermisoComponent;
  let fixture: ComponentFixture<IngresoPermisoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngresoPermisoComponent]
    });
    fixture = TestBed.createComponent(IngresoPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
