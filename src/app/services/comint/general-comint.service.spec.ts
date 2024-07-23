import { TestBed } from '@angular/core/testing';

import { GeneralComintService } from './general-comint.service';

describe('GeneralComintService', () => {
  let service: GeneralComintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralComintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
