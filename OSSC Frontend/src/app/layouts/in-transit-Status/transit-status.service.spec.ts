import { TestBed } from '@angular/core/testing';

import { TransitStatusService } from './transit-status.service';

describe('TransitStatusService', () => {
  let service: TransitStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransitStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
