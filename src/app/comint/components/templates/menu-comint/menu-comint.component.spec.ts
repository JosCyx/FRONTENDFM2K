import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComintComponent } from './menu-comint.component';

describe('MenuComintComponent', () => {
  let component: MenuComintComponent;
  let fixture: ComponentFixture<MenuComintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuComintComponent]
    });
    fixture = TestBed.createComponent(MenuComintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
