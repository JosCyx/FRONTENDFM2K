import { TestBed } from '@angular/core/testing';

import { NivGerenciaService } from './niv-gerencia.service';

describe('NivGerenciaService', () => {
  let service: NivGerenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NivGerenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
