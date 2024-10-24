import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolverDialogComponent } from './devolver-dialog.component';

describe('DevolverDialogComponent', () => {
  let component: DevolverDialogComponent;
  let fixture: ComponentFixture<DevolverDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevolverDialogComponent]
    });
    fixture = TestBed.createComponent(DevolverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
