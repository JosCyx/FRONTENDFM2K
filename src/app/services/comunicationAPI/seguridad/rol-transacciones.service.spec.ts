import { TestBed } from '@angular/core/testing';

import { RolTransaccionesService } from './rol-transacciones.service';

describe('RolTransaccionesService', () => {
  let service: RolTransaccionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolTransaccionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
