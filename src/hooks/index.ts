import { Client, Interaction } from "discord.js";
import consola from "consola";
import commandController from "../commands/commandController";

export default (client: Client) => {
    client.on("ready", () => {
        consola.ready(`Logged in as ${client.user?.tag}!`);
    });

    client.on("warn", (msg) => consola.warn(msg));

    client.on("error", (err) => consola.error(err));

    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        commandController(interaction);
    });
};
