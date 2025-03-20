import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAdminJefeInmComponent } from './vista-admin-jefe-inm.component';

describe('VistaAdminJefeInmComponent', () => {
  let component: VistaAdminJefeInmComponent;
  let fixture: ComponentFixture<VistaAdminJefeInmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAdminJefeInmComponent]
    });
    fixture = TestBed.createComponent(VistaAdminJefeInmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
