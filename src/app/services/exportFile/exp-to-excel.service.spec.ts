import { TestBed } from '@angular/core/testing';

import { ExpToExcelService } from './exp-to-excel.service';

describe('ExpToExcelService', () => {
  let service: ExpToExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpToExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
