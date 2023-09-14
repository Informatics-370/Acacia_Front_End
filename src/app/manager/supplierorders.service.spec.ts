import { TestBed } from '@angular/core/testing';

import { SupplierordersService } from './supplierorders.service';

describe('SupplierordersService', () => {
  let service: SupplierordersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierordersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
