import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainConfiguracionComponent } from './main-configuracion.component';

describe('MainConfiguracionComponent', () => {
  let component: MainConfiguracionComponent;
  let fixture: ComponentFixture<MainConfiguracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainConfiguracionComponent]
    });
    fixture = TestBed.createComponent(MainConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
