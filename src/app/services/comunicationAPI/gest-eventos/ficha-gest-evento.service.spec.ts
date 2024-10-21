import { TestBed } from '@angular/core/testing';

import { FichaGestEventoService } from './ficha-gest-evento.service';

describe('FichaGestEventoService', () => {
  let service: FichaGestEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichaGestEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
