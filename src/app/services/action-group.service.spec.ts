import { TestBed } from '@angular/core/testing';

import { ActionGroupService } from './action-group.service';

describe('ActionGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActionGroupService = TestBed.get(ActionGroupService);
    expect(service).toBeTruthy();
  });
});
