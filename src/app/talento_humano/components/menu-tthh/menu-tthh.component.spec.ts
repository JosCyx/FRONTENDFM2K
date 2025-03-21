import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTthhComponent } from './menu-tthh.component';

describe('MenuTthhComponent', () => {
  let component: MenuTthhComponent;
  let fixture: ComponentFixture<MenuTthhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuTthhComponent]
    });
    fixture = TestBed.createComponent(MenuTthhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
