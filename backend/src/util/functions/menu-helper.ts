import {
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';

export function needHelpButton() {
  return new ButtonBuilder()
    .setCustomId('needHelp')
    .setLabel('Hilfe benötigt')
    .setEmoji('🆘')
    .setStyle(ButtonStyle.Primary);
}

export function selectGuildMenu(guilds: string[]) {
  return new StringSelectMenuBuilder()
    .setCustomId('selectGuild')
    .setPlaceholder('Wähle einen Server aus:')
    .addOptions(
      guilds.map((guildId) => {
        return new StringSelectMenuOptionBuilder()
          .setLabel((this.client.guilds.cache.get(guildId) as any).name)
          .setValue(guildId)
          .setDescription((this.client.guilds.cache.get(guildId) as any).name);
      }),
    );
}

export function modRequestCategorySelect(suffix: string) {
  return new StringSelectMenuBuilder()
    .setCustomId('modRequestMenu')
    .setPlaceholder('Wähle die kategorie deiner Mod Anfrage aus:')
    .addOptions([
      new StringSelectMenuOptionBuilder()
        .setLabel('Problem mit einem Mitglied')
        .setValue(`modRequestUserReport-${suffix}`),
      new StringSelectMenuOptionBuilder()
        .setLabel('Verbesserungsvorschlag')
        .setValue(`modRequestFeedback-${suffix}`),
      new StringSelectMenuOptionBuilder()
        .setLabel('Frage zum Server, Verein o.ä.')
        .setValue(`modRequestQuestion-${suffix}`),
      new StringSelectMenuOptionBuilder()
        .setLabel('Sonstiges')
        .setValue(`modRequestOther-${suffix}`),
    ]);
}
