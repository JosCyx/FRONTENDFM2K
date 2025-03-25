import { TestBed } from '@angular/core/testing';

import { AdminAusService } from './admin-aus.service';

describe('AdminAusService', () => {
  let service: AdminAusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
