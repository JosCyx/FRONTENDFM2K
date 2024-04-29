import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoRegistradoComponent } from './permiso-registrado.component';

describe('PermisoRegistradoComponent', () => {
  let component: PermisoRegistradoComponent;
  let fixture: ComponentFixture<PermisoRegistradoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermisoRegistradoComponent]
    });
    fixture = TestBed.createComponent(PermisoRegistradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
