import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuteoComponent } from './ruteo.component';

describe('RuteoComponent', () => {
  let component: RuteoComponent;
  let fixture: ComponentFixture<RuteoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuteoComponent]
    });
    fixture = TestBed.createComponent(RuteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
