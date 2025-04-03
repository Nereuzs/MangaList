require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require('fs');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Cargar comandos Slash
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// Manejar Slash Commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Error al ejecutar el comando.', ephemeral: true });
  }
});

// Manejar mensajes tradicionales (opcional)
client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.reply('¡Pong! 🏓');
  }

  // Anime: {nombre}
  if (message.content.startsWith('{') && message.content.endsWith('}')) {
    const query = message.content.slice(1, -1).trim();
    require('./commands/anime').execute(message, query.split(' '));
  }

  // Manga: <nombre>
  if (message.content.startsWith('<') && message.content.endsWith('>')) {
    const query = message.content.slice(1, -1).trim();
    require('./commands/manga').execute(message, query.split(' '));
  }
});

// Verificación del token
if (!process.env.DISCORD_TOKEN || process.env.DISCORD_TOKEN.length !== 72) {
  console.error('❌ Token inválido o faltante en .env');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error('❌ Error al conectar:', err.message);
});