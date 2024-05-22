import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarInventarioComponent } from './visualizar-inventario.component';

describe('VisualizarInventarioComponent', () => {
  let component: VisualizarInventarioComponent;
  let fixture: ComponentFixture<VisualizarInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarInventarioComponent]
    });
    fixture = TestBed.createComponent(VisualizarInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
