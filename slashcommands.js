const fs = require("fs");
const discord = require("discord.js");
const config = require("./config.json");
const token = require("./token.json");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId } = require("./config.json");
const commands = [];
const slashcommandsFiles = fs
  .readdirSync("./src/slashcmd")
  .filter((file) => file.endsWith(".js"));

for (const file of slashcommandsFiles) {
  const slash = require(`./src/slashcmd/${file}`);
  commands.push(slash.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token.token);

createSlash();

async function createSlash() {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
