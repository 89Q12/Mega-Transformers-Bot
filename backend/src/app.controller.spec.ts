import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, EventEmitter2],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
  it('should be define', () => {
    expect(appController).toBeDefined();
  });
});
