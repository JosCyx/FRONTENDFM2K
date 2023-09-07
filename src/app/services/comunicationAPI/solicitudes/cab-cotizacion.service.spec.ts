import { TestBed } from '@angular/core/testing';

import { CabCotizacionService } from './cab-cotizacion.service';

describe('CabCotizacionService', () => {
  let service: CabCotizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CabCotizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
