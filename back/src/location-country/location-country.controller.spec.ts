import { Test, TestingModule } from '@nestjs/testing';
import { LocationCountryController } from './location-country.controller';
import { LocationCountryService } from './location-country.service';

describe('LocationCountryController', () => {
  let controller: LocationCountryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationCountryController],
      providers: [LocationCountryService],
    }).compile();

    controller = module.get<LocationCountryController>(LocationCountryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
