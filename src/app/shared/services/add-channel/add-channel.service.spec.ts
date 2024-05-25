import { TestBed } from '@angular/core/testing';

import { AddChannelService } from './add-channel.service';

describe('AddChannelService', () => {
  let service: AddChannelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddChannelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
