import { TestBed } from '@angular/core/testing';

import { DetCotOCService } from './det-cot-oc.service';

describe('DetCotOCService', () => {
  let service: DetCotOCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetCotOCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
