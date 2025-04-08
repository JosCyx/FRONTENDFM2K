import { TestBed } from '@angular/core/testing';

import { ReporteAusService } from './reporte-aus.service';

describe('ReporteAusService', () => {
  let service: ReporteAusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteAusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
