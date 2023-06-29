import { Interaction } from "discord.js";
import { REST } from "@discordjs/rest";
import dotenv from "dotenv";
import commandController from "./commands/commandController";
import de from "./lang/de";
import en from "./lang/en";
import consola from "consola";
import hetznerCloud from "./vendor/hetznerCloud";

const { Routes, Client, GatewayIntentBits } = require("discord.js");

declare global {
    var $lang: Record<string, any>;
    var $hcloud: HetznerClient[];
}

// Configuration
dotenv.config();

if (process.env.LANGUAGE === "de") {
    global.$lang = de;
} else if (process.env.LANGUAGE === "en") {
    global.$lang = en;
}

const commands = [
    {
        name: "status",
        description: "Get the server health status",
    },
];

const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_TOKEN || ""
);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

(async () => {
    try {
        await hetznerCloud();

        if (typeof $hcloud === "undefined") {
            consola.error("HCloud not defined");
            process.exit(1);
        }

        consola.info(`Start registering ${commands.length} commands(/).`);

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || ""),
            { body: commands }
        );

        consola.success(
            `Successfully registered ${commands.length} commands(/).`
        );
    } catch (error) {
        consola.error(error);
    }
})();

client.on("ready", () => {
    consola.success(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    commandController(interaction);
});

client.login(process.env.DISCORD_TOKEN);
