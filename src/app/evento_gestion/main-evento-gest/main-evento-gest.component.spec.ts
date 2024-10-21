import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEventoGestComponent } from './main-evento-gest.component';

describe('MainEventoGestComponent', () => {
  let component: MainEventoGestComponent;
  let fixture: ComponentFixture<MainEventoGestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainEventoGestComponent]
    });
    fixture = TestBed.createComponent(MainEventoGestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
