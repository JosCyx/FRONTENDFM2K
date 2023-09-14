import { TestBed } from '@angular/core/testing';

import { ProvCotizacionService } from './prov-cotizacion.service';

describe('ProvCotizacionService', () => {
  let service: ProvCotizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvCotizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
