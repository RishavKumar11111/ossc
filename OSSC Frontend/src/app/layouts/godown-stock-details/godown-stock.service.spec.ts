import { TestBed } from '@angular/core/testing';

import { GodownStockService } from './godown-stock.service';

describe('GodownStockService', () => {
  let service: GodownStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GodownStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
