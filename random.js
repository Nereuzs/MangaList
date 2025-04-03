const { SlashCommandBuilder } = require('discord.js');
const { getRandomAnime, getRandomManga } = require('../mal/api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random')
    .setDescription('Recomendación aleatoria de anime/manga')
    .addStringOption(option =>
      option
        .setName('tipo')
        .setDescription('Elije "anime" o "manga"')
        .setRequired(true)
        .addChoices(
          { name: 'Anime', value: 'anime' },
          { name: 'Manga', value: 'manga' }
        )
    )
    .addStringOption(option =>
      option
        .setName('genero')
        .setDescription('Ejemplo: action, romance')
        .setRequired(false)
    ),
  async execute(interaction) {
    const type = interaction.options.getString('tipo');
    const genre = interaction.options.getString('genero') || null;
    
    const randomFunction = type === 'anime' ? getRandomAnime : getRandomManga;
    const result = await randomFunction(genre);
    
    const emoji = type === 'anime' ? '🎬' : '📖';
    await interaction.reply(`${emoji} Recomendación ${type}: **${result.title}** (⭐ ${result.score || 'Sin puntuación'})`);
  }
};