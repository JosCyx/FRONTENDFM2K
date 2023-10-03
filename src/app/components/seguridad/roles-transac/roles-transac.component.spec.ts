import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesTransacComponent } from './roles-transac.component';

describe('RolesTransacComponent', () => {
  let component: RolesTransacComponent;
  let fixture: ComponentFixture<RolesTransacComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolesTransacComponent]
    });
    fixture = TestBed.createComponent(RolesTransacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
