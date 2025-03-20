import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAdminMotivosComponent } from './vista-admin-motivos.component';

describe('VistaAdminMotivosComponent', () => {
  let component: VistaAdminMotivosComponent;
  let fixture: ComponentFixture<VistaAdminMotivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAdminMotivosComponent]
    });
    fixture = TestBed.createComponent(VistaAdminMotivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
