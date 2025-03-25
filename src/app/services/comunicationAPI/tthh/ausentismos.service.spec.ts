import { TestBed } from '@angular/core/testing';

import { AusentismosService } from './ausentismos.service';

describe('AusentismosService', () => {
  let service: AusentismosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AusentismosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
