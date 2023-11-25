import { WrongArgsException } from '@discord-nestjs/common';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Colors, EmbedBuilder } from 'discord.js';

@Catch(WrongArgsException)
export class CommandValidationFilter implements ExceptionFilter {
  async catch(
    exceptionList: WrongArgsException,
    host: ArgumentsHost,
  ): Promise<void> {
    const interaction = host.getArgByIndex(0);
    console.log(exceptionList.getError());
    const embeds = exceptionList.getError().map((exception) =>
      new EmbedBuilder()
        .setDescription(`For input: ${exception.property}`)
        .setTitle('Validation failed')
        .setColor(Colors.Red)
        .addFields(
          Object.keys(exception.constraints).map((key) => ({
            name: key,
            value: exception.constraints[key],
          })),
        ),
    );

    if (interaction.isRepliable())
      await interaction.reply({ embeds, ephemeral: true });
  }
}
