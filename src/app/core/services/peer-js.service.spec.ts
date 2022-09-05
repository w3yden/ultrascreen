import { TestBed } from '@angular/core/testing';

import { PeerJsService } from './peer-js.service';

describe('PeerJsService', () => {
  let service: PeerJsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeerJsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
