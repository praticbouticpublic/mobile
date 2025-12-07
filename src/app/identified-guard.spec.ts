import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { identifiedGuard } from './identified-guard';

describe('identifiedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => identifiedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
