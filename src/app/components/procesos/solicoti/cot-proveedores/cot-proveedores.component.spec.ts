import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotProveedoresComponent } from './cot-proveedores.component';

describe('CotProveedoresComponent', () => {
  let component: CotProveedoresComponent;
  let fixture: ComponentFixture<CotProveedoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CotProveedoresComponent]
    });
    fixture = TestBed.createComponent(CotProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
