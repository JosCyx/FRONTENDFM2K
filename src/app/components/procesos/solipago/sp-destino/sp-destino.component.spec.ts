import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpDestinoComponent } from './sp-destino.component';

describe('SpDestinoComponent', () => {
  let component: SpDestinoComponent;
  let fixture: ComponentFixture<SpDestinoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpDestinoComponent]
    });
    fixture = TestBed.createComponent(SpDestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
