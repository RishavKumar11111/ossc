import { TestBed } from '@angular/core/testing';

import { SaleReturnService } from './sale-return.service';

describe('SaleReturnService', () => {
  let service: SaleReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
