import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicotiComponent } from './solicoti.component';

describe('SolicotiComponent', () => {
  let component: SolicotiComponent;
  let fixture: ComponentFixture<SolicotiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicotiComponent]
    });
    fixture = TestBed.createComponent(SolicotiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
