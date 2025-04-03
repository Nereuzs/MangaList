const { SlashCommandBuilder } = require('discord.js');
const { searchManga } = require('../mal/api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('manga')
    .setDescription('Busca información de un manga en MyAnimeList')
    .addStringOption(option =>
      option
        .setName('nombre')
        .setDescription('Ejemplo: Berserk')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('nombre');
    const results = await searchManga(query);
    
    const reply = results.map(manga => 
      `📖 **${manga.node.title}**\n🔹 **Tipo:** ${manga.node.media_type}\n🔹 **Capítulos:** ${manga.node.num_chapters || '?'}\n🔹 [Ver en MAL](${manga.node.url})`
    ).join('\n\n');

    await interaction.reply(reply || 'No encontré ese manga. 😢');
  }
};