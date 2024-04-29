import { TestBed } from '@angular/core/testing';

import { TpformService } from './tpform.service';

describe('TpformService', () => {
  let service: TpformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TpformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
