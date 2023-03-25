import { Interaction } from "discord.js";

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    execute(interaction: Interaction) {
        // await interaction.reply("Pong!");
        console.log(interaction);
    },
};
