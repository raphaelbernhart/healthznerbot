import Discord, { Channel, Intents, TextChannel } from "discord.js";
import axios from "axios";
import dotenv from "dotenv";

const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
dotenv.config();

import ConfigCheck from "./helper/ConfigCheck";
ConfigCheck();

import Logger from "./helper/Logger";

import CommandListener from "./commands/CommandListener";
import StatusUpdate from "./worker/StatusUpdate";
import ServersUpdate from "./worker/ServersUpdate";

import HCloudClientsInit from "./services/HCloudClientsInit";

const main = async () => {
    // Login on Discord Server
    try {
        client.on("ready", () => {
            Logger.success(`(DISCORD) Logged in as ${client.user?.tag}!`);
        });
    } catch (err: any) {
        Logger.error(err);
    }

    await client.login(process.env.DISCORD_TOKEN);

    const HCloudClients: Array<HetznerClient> = await HCloudClientsInit();

    let lastUpdate: Array<number> | boolean;

    // Status update Interval
    if (parseFloat(process.env.STATUS_UPDATE_INTERVAL || "2.5") !== 0) {
        setInterval(async () => {
            let channel = client.channels.cache.get(
                process.env.DISCORD_CHANNEL || ""
            );
            if (channel?.type == "GUILD_TEXT") {
                let channel = <TextChannel>(
                    client.channels.cache.get(process.env.DISCORD_CHANNEL || "")
                );

                lastUpdate = await StatusUpdate(
                    channel,
                    HCloudClients,
                    undefined,
                    lastUpdate
                );
            }
        }, parseFloat(process.env.STATUS_UPDATE_INTERVAL || "2.5") * 60000);
    }

    // Server Metrics Interval
    if (parseFloat(process.env.SERVER_METRICS_INTERVAL || "0") !== 0) {
        setInterval(async () => {
            let channel = client.channels.cache.get(
                process.env.DISCORD_CHANNEL || ""
            );
            if (channel?.type == "GUILD_TEXT") {
                let channel = <TextChannel>(
                    client.channels.cache.get(process.env.DISCORD_CHANNEL || "")
                );
                const msg: any = null;
                await ServersUpdate(msg, HCloudClients, client);
            }
        }, parseFloat(process.env.SERVER_METRICS_INTERVAL || "0") * 60000);
    }

    const CmdListener = CommandListener.init(client, HCloudClients);
    if (CmdListener.status) Logger.info(CmdListener.text as string);
};

main();
