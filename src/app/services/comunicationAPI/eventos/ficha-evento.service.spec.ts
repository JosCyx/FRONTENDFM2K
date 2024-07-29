import { TestBed } from '@angular/core/testing';

import { FichaEventoService } from './ficha-evento.service';

describe('FichaEventoService', () => {
  let service: FichaEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichaEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
