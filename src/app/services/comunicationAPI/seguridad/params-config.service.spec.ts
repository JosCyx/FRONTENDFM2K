import { TestBed } from '@angular/core/testing';

import { ParamsConfigService } from './params-config.service';

describe('ParamsConfigService', () => {
  let service: ParamsConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParamsConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
