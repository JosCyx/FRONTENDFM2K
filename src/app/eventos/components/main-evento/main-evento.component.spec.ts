import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEventoComponent } from './main-evento.component';

describe('MainEventoComponent', () => {
  let component: MainEventoComponent;
  let fixture: ComponentFixture<MainEventoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainEventoComponent]
    });
    fixture = TestBed.createComponent(MainEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
