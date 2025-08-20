import { TestBed } from '@angular/core/testing';

import { SessionbackService } from './sessionback.service';

describe('SessionbackService', () => {
  let service: SessionbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
