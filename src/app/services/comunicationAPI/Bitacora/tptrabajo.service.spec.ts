import { TestBed } from '@angular/core/testing';

import { TptrabajoService } from './tptrabajo.service';

describe('TptrabajoService', () => {
  let service: TptrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TptrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
