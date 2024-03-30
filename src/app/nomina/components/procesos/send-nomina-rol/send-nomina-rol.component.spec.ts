/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendNominaRolComponent } from './send-nomina-rol.component';

describe('SendNominaRolComponent', () => {
  let component: SendNominaRolComponent;
  let fixture: ComponentFixture<SendNominaRolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendNominaRolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendNominaRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
