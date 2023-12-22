import { TestBed } from '@angular/core/testing';

import { FacturasPagoService } from './facturas-pago.service';

describe('FacturasPagoService', () => {
  let service: FacturasPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturasPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
