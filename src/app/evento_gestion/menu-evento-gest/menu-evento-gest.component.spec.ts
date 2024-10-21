import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEventoGestComponent } from './menu-evento-gest.component';

describe('MenuEventoGestComponent', () => {
  let component: MenuEventoGestComponent;
  let fixture: ComponentFixture<MenuEventoGestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuEventoGestComponent]
    });
    fixture = TestBed.createComponent(MenuEventoGestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
