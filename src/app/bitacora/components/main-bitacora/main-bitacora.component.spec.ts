import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBitacoraComponent } from './main-bitacora.component';

describe('MainBitacoraComponent', () => {
  let component: MainBitacoraComponent;
  let fixture: ComponentFixture<MainBitacoraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainBitacoraComponent]
    });
    fixture = TestBed.createComponent(MainBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
