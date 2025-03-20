import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaRegistroAusentismoComponent } from './vista-registro-ausentismo.component';

describe('VistaRegistroAusentismoComponent', () => {
  let component: VistaRegistroAusentismoComponent;
  let fixture: ComponentFixture<VistaRegistroAusentismoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaRegistroAusentismoComponent]
    });
    fixture = TestBed.createComponent(VistaRegistroAusentismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
