import { TestBed } from '@angular/core/testing';

import { PermisotrabajoService } from './permisotrabajo.service';

describe('PermisotrabajoService', () => {
  let service: PermisotrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermisotrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
