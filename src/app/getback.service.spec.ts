import { TestBed } from '@angular/core/testing';

import { GetbackService } from './getback.service';

describe('GetbackService', () => {
  let service: GetbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
