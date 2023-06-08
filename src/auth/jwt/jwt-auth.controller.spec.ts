import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthController } from './jwt-auth.controller';

describe('JwtAuthController', () => {
  let controller: JwtAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JwtAuthController],
    }).compile();

    controller = module.get<JwtAuthController>(JwtAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
