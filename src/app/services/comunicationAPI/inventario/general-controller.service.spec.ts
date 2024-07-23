import { TestBed } from '@angular/core/testing';

import { GeneralControllerService } from './general-controller.service';

describe('GeneralControllerService', () => {
  let service: GeneralControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
