import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEventoComponent } from './menu-evento.component';

describe('MenuEventoComponent', () => {
  let component: MenuEventoComponent;
  let fixture: ComponentFixture<MenuEventoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuEventoComponent]
    });
    fixture = TestBed.createComponent(MenuEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
