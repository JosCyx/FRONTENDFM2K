import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAdminParametrosComponent } from './vista-admin-parametros.component';

describe('VistaAdminParametrosComponent', () => {
  let component: VistaAdminParametrosComponent;
  let fixture: ComponentFixture<VistaAdminParametrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAdminParametrosComponent]
    });
    fixture = TestBed.createComponent(VistaAdminParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
