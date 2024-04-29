import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBitacoraComponent } from './menu-bitacora.component';

describe('MenuBitacoraComponent', () => {
  let component: MenuBitacoraComponent;
  let fixture: ComponentFixture<MenuBitacoraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuBitacoraComponent]
    });
    fixture = TestBed.createComponent(MenuBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
