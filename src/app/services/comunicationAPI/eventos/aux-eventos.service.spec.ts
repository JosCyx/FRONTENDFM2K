import { TestBed } from '@angular/core/testing';

import { AuxEventosService } from './aux-eventos.service';

describe('AuxEventosService', () => {
  let service: AuxEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuxEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
