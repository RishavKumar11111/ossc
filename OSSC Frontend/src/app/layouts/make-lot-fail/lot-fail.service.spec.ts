import { TestBed } from '@angular/core/testing';

import { LotFailService } from './lot-fail.service';

describe('LotFailService', () => {
  let service: LotFailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LotFailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
