import { TestBed } from '@angular/core/testing';

import { DestinoPagoServiceService } from './destino-pago-service.service';

describe('DestinoPagoServiceService', () => {
  let service: DestinoPagoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestinoPagoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
