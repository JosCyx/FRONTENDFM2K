import { TestBed } from '@angular/core/testing';

import { CabOrdCompraService } from './cab-ord-compra.service';

describe('CabOrdCompraService', () => {
  let service: CabOrdCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CabOrdCompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
