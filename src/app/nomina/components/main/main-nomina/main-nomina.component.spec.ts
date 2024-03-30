/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MainNominaComponent } from './main-nomina.component';

describe('MainNominaComponent', () => {
  let component: MainNominaComponent;
  let fixture: ComponentFixture<MainNominaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainNominaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
