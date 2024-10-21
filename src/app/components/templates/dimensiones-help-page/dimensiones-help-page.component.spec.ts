import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionesHelpPageComponent } from './dimensiones-help-page.component';

describe('DimensionesHelpPageComponent', () => {
  let component: DimensionesHelpPageComponent;
  let fixture: ComponentFixture<DimensionesHelpPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DimensionesHelpPageComponent]
    });
    fixture = TestBed.createComponent(DimensionesHelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
