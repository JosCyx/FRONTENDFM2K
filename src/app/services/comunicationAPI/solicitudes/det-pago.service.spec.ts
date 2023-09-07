import { TestBed } from '@angular/core/testing';

import { DetPagoService } from './det-pago.service';

describe('DetPagoService', () => {
  let service: DetPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
