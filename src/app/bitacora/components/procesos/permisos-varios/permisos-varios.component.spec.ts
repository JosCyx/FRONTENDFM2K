import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisosVariosComponent } from './permisos-varios.component';

describe('PermisosVariosComponent', () => {
  let component: PermisosVariosComponent;
  let fixture: ComponentFixture<PermisosVariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermisosVariosComponent]
    });
    fixture = TestBed.createComponent(PermisosVariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
