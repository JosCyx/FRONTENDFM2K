import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpAnulacionComponent } from './sp-anulacion.component';

describe('SpAnulacionComponent', () => {
  let component: SpAnulacionComponent;
  let fixture: ComponentFixture<SpAnulacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpAnulacionComponent]
    });
    fixture = TestBed.createComponent(SpAnulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
