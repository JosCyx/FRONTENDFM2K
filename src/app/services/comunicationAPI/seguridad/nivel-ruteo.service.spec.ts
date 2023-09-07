import { TestBed } from '@angular/core/testing';

import { NivelRuteoService } from './nivel-ruteo.service';

describe('NivelRuteoService', () => {
  let service: NivelRuteoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NivelRuteoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
