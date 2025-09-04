import { Test, TestingModule } from '@nestjs/testing';
import { LocationCountryService } from './location-country.service';

describe('LocationCountryService', () => {
  let service: LocationCountryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationCountryService],
    }).compile();

    service = module.get<LocationCountryService>(LocationCountryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
