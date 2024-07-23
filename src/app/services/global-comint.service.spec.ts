import { TestBed } from '@angular/core/testing';

import { GlobalComintService } from './global-comint.service';

describe('GlobalComintService', () => {
  let service: GlobalComintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalComintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
