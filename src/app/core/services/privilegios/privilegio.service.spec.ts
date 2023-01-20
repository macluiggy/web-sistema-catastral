import { TestBed } from '@angular/core/testing';

import { PrivilegioService } from './privilegio.service';

describe('PrivilegioService', () => {
  let service: PrivilegioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivilegioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
