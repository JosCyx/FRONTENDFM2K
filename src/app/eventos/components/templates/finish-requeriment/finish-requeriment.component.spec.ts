import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishRequerimentComponent } from './finish-requeriment.component';

describe('FinishRequerimentComponent', () => {
  let component: FinishRequerimentComponent;
  let fixture: ComponentFixture<FinishRequerimentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinishRequerimentComponent]
    });
    fixture = TestBed.createComponent(FinishRequerimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
