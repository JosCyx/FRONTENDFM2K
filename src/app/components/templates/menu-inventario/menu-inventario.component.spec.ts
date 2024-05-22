import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuInventarioComponent } from './menu-inventario.component';

describe('MenuInventarioComponent', () => {
  let component: MenuInventarioComponent;
  let fixture: ComponentFixture<MenuInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuInventarioComponent]
    });
    fixture = TestBed.createComponent(MenuInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
