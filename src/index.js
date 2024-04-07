const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const config = require("../config.json");
const token = require("../token.json");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [
    Partials.USER,
    Partials.GUILD_MEMBER,
    Partials.MESSAGE,
    Partials.REACTION,
  ],
});

client.on("ready", () => {
  console.log(`¡Listo como ${client.user.tag}!`);
});

client.login(token.token);

// Manejador de eventos para capturar errores en el cliente Discord.js
client.on("error", console.error);

client.slashcommands = new Collection();
const slashcommandsDir = path.join(__dirname, "slashcmd"); // Ruta al directorio slashcmd

try {
  // Verificar si la carpeta slashcmd existe
  fs.accessSync(slashcommandsDir, fs.constants.R_OK | fs.constants.W_OK);
} catch (err) {
  console.error("Error al acceder a la carpeta slashcmd:", err);
  process.exit(1); // Salir con código de error
}

const slashcommandsFiles = fs
  .readdirSync(slashcommandsDir)
  .filter((file) => file.endsWith(".js"));

for (const file of slashcommandsFiles) {
  const slash = require(path.join(slashcommandsDir, file));
  console.log(`Cargado comando slash: ${file}`);
  client.slashcommands.set(slash.data.name, slash);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const slashcmds = client.slashcommands.get(interaction.commandName);

  if (!slashcmds) return;

  try {
    await slashcmds.run(client, interaction);
  } catch (error) {
    console.error(error);
  }
});
