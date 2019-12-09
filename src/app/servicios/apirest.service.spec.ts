import { TestBed } from '@angular/core/testing';

import { ApirestService } from './apirest.service';

describe('ApirestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApirestService = TestBed.get(ApirestService);
    expect(service).toBeTruthy();
  });
});
