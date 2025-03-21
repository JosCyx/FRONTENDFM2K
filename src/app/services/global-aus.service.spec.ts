import { TestBed } from '@angular/core/testing';

import { GlobalAusService } from './global-aus.service';

describe('GlobalAusService', () => {
  let service: GlobalAusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalAusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
