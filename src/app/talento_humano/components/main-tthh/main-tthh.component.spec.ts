import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTthhComponent } from './main-tthh.component';

describe('MainTthhComponent', () => {
  let component: MainTthhComponent;
  let fixture: ComponentFixture<MainTthhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainTthhComponent]
    });
    fixture = TestBed.createComponent(MainTthhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
