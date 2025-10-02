import { TestBed } from '@angular/core/testing';

import { SelparamService } from './selparam.service';

describe('SelparamService', () => {
  let service: SelparamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelparamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
