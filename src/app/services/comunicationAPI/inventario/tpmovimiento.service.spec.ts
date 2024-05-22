import { TestBed } from '@angular/core/testing';

import { TPMovimientoService } from './tpmovimiento.service';

describe('TPMovimientoService', () => {
  let service: TPMovimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TPMovimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
