import { TestBed } from '@angular/core/testing';

import { ItemSectorService } from './item-sector.service';

describe('ItemSectorService', () => {
  let service: ItemSectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemSectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
