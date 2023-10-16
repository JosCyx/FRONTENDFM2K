import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcAnulacionComponent } from './oc-anulacion.component';

describe('OcAnulacionComponent', () => {
  let component: OcAnulacionComponent;
  let fixture: ComponentFixture<OcAnulacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OcAnulacionComponent]
    });
    fixture = TestBed.createComponent(OcAnulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
