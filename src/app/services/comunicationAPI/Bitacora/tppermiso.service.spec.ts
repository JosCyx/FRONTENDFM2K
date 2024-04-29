import { TestBed } from '@angular/core/testing';

import { TppermisoService } from './tppermiso.service';

describe('TppermisoService', () => {
  let service: TppermisoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TppermisoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
