import { REST } from "@discordjs/rest";
import dotenv from "dotenv";
import { commands } from "./commands/commandController";
import de from "./lang/de";
import en from "./lang/en";
import consola from "consola";
import HetznerCloud from "./vendor/hetznerCloud";
import hooks from "./hooks";
import worker from "./worker/index";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import ConfigCheck from "./helper/ConfigCheck";
import { Client as DiscordClient } from "discord.js";

const { Routes, Client, GatewayIntentBits } = require("discord.js");

declare global {
    var $lang: Record<string, any>;
    var $hcloud: HetznerClient[];
    var $discordClient: DiscordClient;
}

// Configuration
dotenv.config();
dayjs.extend(duration);

ConfigCheck();

// Globals
if (process.env.LANGUAGE === "de") {
    global.$lang = de;
} else if (process.env.LANGUAGE === "en") {
    global.$lang = en;
}

const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_TOKEN || ""
);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
global.$discordClient = client;

const main = async () => {
    try {
        await HetznerCloud.initHCloud();

        if (typeof $hcloud === "undefined") {
            consola.error("HCloud not defined");
            process.exit(1);
        }

        consola.start(`Start registering ${commands.length} commands(/).`);

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || ""),
            { body: commands }
        );

        consola.success(
            `Successfully registered ${commands.length} commands(/).`
        );

        consola.start("Logging in the bot");
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        consola.error(error);
        process.exit(1);
    }

    // Register workers
    worker(client);
};

// Register hooks
hooks(client);

// Run main function
main();
