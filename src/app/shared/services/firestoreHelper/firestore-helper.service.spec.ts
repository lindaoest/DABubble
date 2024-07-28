import { TestBed } from '@angular/core/testing';

import { FirestoreHelperService } from './firestore-helper.service';

describe('FirestoreHelperService', () => {
  let service: FirestoreHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
