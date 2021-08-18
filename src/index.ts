import Discord, { Channel, TextChannel } from 'discord.js';
import axios from 'axios';
import dotenv from 'dotenv';

const client = new Discord.Client();
dotenv.config();

import ConfigCheck from './helper/ConfigCheck'
ConfigCheck()

import Logger from './helper/Logger'

import CommandListener from './Commands/CommandListener'
import StatusUpdate from './Worker/StatusUpdate'
import ServersUpdate from './Worker/ServersUpdate'

import HCloudClientsInit from './services/HCloudClientsInit'

const main = async () => {
    // Login on Discord Server
    try {
        client.on('ready', () => {
            Logger.success(`(DISCORD) Logged in as ${client.user.tag}!`)
        })
    } catch(err: any) {
        Logger.error(err)
    }

    await client.login(process.env.DISCORD_TOKEN);

    const HCloudClients: Array<HetznerClient> = await HCloudClientsInit()

    let lastUpdate: Array<number> | boolean;

    // Status update Interval
    if (parseFloat(process.env.STATUS_UPDATE_INTERVAL) !== 0) {
        setInterval(async () => {
            let channel: Channel = client.channels.cache.get(process.env.DISCORD_CHANNEL);
            if(channel.type == "text") {
                let channel = <TextChannel> client.channels.cache.get(process.env.DISCORD_CHANNEL);

                lastUpdate = await StatusUpdate(channel, HCloudClients, undefined, lastUpdate);
            }
        }, parseFloat(process.env.STATUS_UPDATE_INTERVAL) * 60000);
    }

    // Server Metrics Interval
    if (parseFloat(process.env.SERVER_METRICS_INTERVAL) !== 0) {
        setInterval(async () => {
            let channel: Channel = client.channels.cache.get(process.env.DISCORD_CHANNEL);
            if(channel.type == "text") {
                let channel = <TextChannel> client.channels.cache.get(process.env.DISCORD_CHANNEL);
                const msg: any = null;
                await ServersUpdate(msg, HCloudClients, client)
            }
        }, parseFloat(process.env.SERVER_METRICS_INTERVAL) * 60000);
    }

    const CmdListener = CommandListener.init(client, HCloudClients);
    if(CmdListener.status) Logger.info(CmdListener.text as string);
}

main()