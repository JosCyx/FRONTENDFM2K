import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDialogTthhComponent } from './message-dialog-tthh.component';

describe('MessageDialogTthhComponent', () => {
  let component: MessageDialogTthhComponent;
  let fixture: ComponentFixture<MessageDialogTthhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageDialogTthhComponent]
    });
    fixture = TestBed.createComponent(MessageDialogTthhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
