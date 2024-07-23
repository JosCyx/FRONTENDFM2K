import { TestBed } from '@angular/core/testing';

import { MovimientosControllerService } from './movimientos-controller.service';

describe('MovimientosControllerService', () => {
  let service: MovimientosControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientosControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
