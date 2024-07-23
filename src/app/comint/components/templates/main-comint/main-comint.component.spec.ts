import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComintComponent } from './main-comint.component';

describe('MainComintComponent', () => {
  let component: MainComintComponent;
  let fixture: ComponentFixture<MainComintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainComintComponent]
    });
    fixture = TestBed.createComponent(MainComintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
