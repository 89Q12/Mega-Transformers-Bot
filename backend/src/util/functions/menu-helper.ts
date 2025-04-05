import {
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
export const needHelpButtonId = 'createTicket';
export const modRequestMenuId = 'modRequestMenu';
/**
 * Utility function that returns a button builder named "Hilfe benötigt"
 * @returns ButtonBuilder object that can directly be used with discord.js
 */
export function needHelpButton(): ButtonBuilder {
  return new ButtonBuilder()
    .setCustomId(needHelpButtonId)
    .setLabel('Ticket mit dem Mods erstellen.')
    .setStyle(ButtonStyle.Primary);
}

/**
 * Utility function that returns a SelectMenu to choose a guild.
 * @param guilds Array<string> of guildIDs
 * @returns  StringSelectMenuBuilder object that can directly be used with discord.js
 */
export function selectGuildMenu(guilds: string[]): StringSelectMenuBuilder {
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

/**
 * Returns a SelectMenu for the ModRequest functionality
 * @param suffix Some string to suffix the the value of each field
 * @returns StringSelectMenuBuilder object that can directly be used with discord.js
 */
export function modRequestCategorySelect(
  suffix: string,
): StringSelectMenuBuilder {
  return new StringSelectMenuBuilder()
    .setCustomId(modRequestMenuId)
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
