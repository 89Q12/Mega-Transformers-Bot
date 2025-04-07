import { ReflectMetadataProvider } from '@discord-nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { MumVoiceCommandChatInput } from './mod-anouncement.command';

describe('MumVoiceCommand', () => {
  let command: MumVoiceCommandChatInput;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MumVoiceCommandChatInput, ReflectMetadataProvider],
    }).compile();

    command = module.get<MumVoiceCommandChatInput>(MumVoiceCommandChatInput);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });
});
