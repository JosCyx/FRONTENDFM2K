import { TestBed } from '@angular/core/testing';

import { PermisoSIService } from './permiso-si.service';

describe('PermisoSIService', () => {
  let service: PermisoSIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermisoSIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
