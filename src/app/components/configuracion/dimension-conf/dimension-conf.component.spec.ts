import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionConfComponent } from './dimension-conf.component';

describe('DimensionConfComponent', () => {
  let component: DimensionConfComponent;
  let fixture: ComponentFixture<DimensionConfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DimensionConfComponent]
    });
    fixture = TestBed.createComponent(DimensionConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
