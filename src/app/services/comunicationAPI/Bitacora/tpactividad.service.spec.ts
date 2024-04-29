import { TestBed } from '@angular/core/testing';

import { TpactividadService } from './tpactividad.service';

describe('TpactividadService', () => {
  let service: TpactividadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TpactividadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
