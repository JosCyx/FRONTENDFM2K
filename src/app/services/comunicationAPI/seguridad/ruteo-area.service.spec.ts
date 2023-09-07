import { TestBed } from '@angular/core/testing';

import { RuteoAreaService } from './ruteo-area.service';

describe('RuteoAreaService', () => {
  let service: RuteoAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuteoAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
