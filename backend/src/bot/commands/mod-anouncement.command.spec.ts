import { ReflectMetadataProvider } from '@discord-nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { MumVoiceCommand } from './mod-anouncement.command';

describe('MumVoiceCommand', () => {
  let command: MumVoiceCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MumVoiceCommand, ReflectMetadataProvider],
    }).compile();

    command = module.get<MumVoiceCommand>(MumVoiceCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
