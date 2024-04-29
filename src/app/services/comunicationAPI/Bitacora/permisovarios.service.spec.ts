import { TestBed } from '@angular/core/testing';

import { PermisovariosService } from './permisovarios.service';

describe('PermisovariosService', () => {
  let service: PermisovariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermisovariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
