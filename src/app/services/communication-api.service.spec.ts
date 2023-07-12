import { TestBed } from '@angular/core/testing';

import { CommunicationApiService } from './communication-api.service';

describe('CommunicationApiService', () => {
  let service: CommunicationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
