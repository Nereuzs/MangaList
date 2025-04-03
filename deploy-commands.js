const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('📂 Comandos encontrados:', commandFiles); // Debug

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if (!command.data) {
    console.warn(`⚠️ El comando ${file} no tiene "data". Se omitirá.`);
    continue;
  }
  
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🔄 Registrando ${commands.length} comandos...`);
    
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );
    
    console.log(`✅ ${data.length} comandos registrados con éxito!`);
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
})();