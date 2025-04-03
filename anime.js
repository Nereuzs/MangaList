const { SlashCommandBuilder } = require('discord.js');
const { searchAnime } = require('../mal/api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('Busca información de un anime en MyAnimeList')
    .addStringOption(option =>
      option
        .setName('nombre')
        .setDescription('Ejemplo: Attack on Titan')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('nombre');
    const results = await searchAnime(query);
    
    const reply = results.map(anime => 
      `🎬 **${anime.node.title}**\n🔹 **Tipo:** ${anime.node.media_type}\n🔹 **Episodios:** ${anime.node.num_episodes || '?'}\n🔹 [Ver en MAL](${anime.node.url})`
    ).join('\n\n');

    await interaction.reply(reply || 'No encontré ese anime. 😢');
  }
};