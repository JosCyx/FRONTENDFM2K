import { TestBed } from '@angular/core/testing';

import { GlobalEventosService } from './global-eventos.service';

describe('GlobalEventosService', () => {
  let service: GlobalEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
