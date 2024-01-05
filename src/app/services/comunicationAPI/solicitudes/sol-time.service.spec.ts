import { TestBed } from '@angular/core/testing';

import { SolTimeService } from './sol-time.service';

describe('SolTimeService', () => {
  let service: SolTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
