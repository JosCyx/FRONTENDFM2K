import { TestBed } from '@angular/core/testing';

import { ProductoControllerService } from './producto-controller.service';

describe('ProductoControllerService', () => {
  let service: ProductoControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
