import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSeguridadComponent } from './main-seguridad.component';

describe('MainSeguridadComponent', () => {
  let component: MainSeguridadComponent;
  let fixture: ComponentFixture<MainSeguridadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainSeguridadComponent]
    });
    fixture = TestBed.createComponent(MainSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
