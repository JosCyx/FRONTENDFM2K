import { TestBed } from '@angular/core/testing';

import { CabPagoService } from './cab-pago.service';

describe('CabPagoService', () => {
  let service: CabPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CabPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
