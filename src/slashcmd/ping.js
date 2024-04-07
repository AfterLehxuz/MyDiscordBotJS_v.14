const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('El bot te responderá con su ping en ms'),

  async run(client, interaction) {
    interaction.reply({ content: `Pong! **${client.ws.ping}ms**` });
  },
};
