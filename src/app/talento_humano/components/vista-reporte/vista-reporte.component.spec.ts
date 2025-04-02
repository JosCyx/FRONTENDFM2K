import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaReporteComponent } from './vista-reporte.component';

describe('VistaReporteComponent', () => {
  let component: VistaReporteComponent;
  let fixture: ComponentFixture<VistaReporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaReporteComponent]
    });
    fixture = TestBed.createComponent(VistaReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
