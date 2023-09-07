import { TestBed } from '@angular/core/testing';

import { TipoSolService } from './tipo-sol.service';

describe('TipoSolService', () => {
  let service: TipoSolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoSolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
