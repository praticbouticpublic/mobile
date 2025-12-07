import { TestBed } from '@angular/core/testing';

import { CheckversionService } from './checkversion.service';

describe('CheckversionService', () => {
  let service: CheckversionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckversionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
