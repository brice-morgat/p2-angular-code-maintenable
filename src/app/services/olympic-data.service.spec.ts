/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OlympicDataService } from './olympic-data.service';

describe('Service: OlympicData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OlympicDataService]
    });
  });

  it('should ...', inject([OlympicDataService], (service: OlympicDataService) => {
    expect(service).toBeTruthy();
  }));
});
