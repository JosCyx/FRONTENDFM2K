import { TestBed } from '@angular/core/testing';

import { GlobalInventarioService } from './global-inventario.service';

describe('GlobalInventarioService', () => {
  let service: GlobalInventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalInventarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
