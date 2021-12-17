import { TestBed } from '@angular/core/testing';

import { StockForReceiptService } from './stock-for-receipt.service';

describe('StockForReceiptService', () => {
  let service: StockForReceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockForReceiptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
