import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDimensionesComponent } from './add-dimensiones.component';

describe('AddDimensionesComponent', () => {
  let component: AddDimensionesComponent;
  let fixture: ComponentFixture<AddDimensionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDimensionesComponent]
    });
    fixture = TestBed.createComponent(AddDimensionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
