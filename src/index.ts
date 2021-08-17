import Discord, { Channel, TextChannel } from 'discord.js';
const client = new Discord.Client();

import dotenv from 'dotenv';
dotenv.config();

import ConfigCheck from './helper/ConfigCheck'
ConfigCheck()

import Logger from './helper/Logger'

const Cloud = require('hetzner-cloud-api');
const hclient = new Cloud(process.env.HETZNER_TOKEN);

import StatusUpdate from './Worker/StatusUpdate'
import ServersUpdate from './Worker/ServersUpdate'

client.on('ready', () => {
    Logger.success(`Logged in as ${client.user.tag}!`)

    let lastUpdate: Array<number> | boolean;

    // Status update Interval
    if (parseFloat(process.env.STATUS_UPDATE_INTERVAL) !== 0) {
        setInterval(async () => {
            let channel: Channel = client.channels.cache.get(process.env.DISCORD_CHANNEL);
            if(channel.type == "text") {
                let channel = <TextChannel> client.channels.cache.get(process.env.DISCORD_CHANNEL);
                lastUpdate = await StatusUpdate(channel, hclient, undefined, lastUpdate);
            }
        }, parseFloat(process.env.STATUS_UPDATE_INTERVAL) * 60000);
    }

    // Server Metrics Interval
    if (parseFloat(process.env.SERVER_METRICS_PERIOD) !== 0) {
        setInterval(async () => {
            let channel: Channel = client.channels.cache.get(process.env.DISCORD_CHANNEL);
            if(channel.type == "text") {
                let channel = <TextChannel> client.channels.cache.get(process.env.DISCORD_CHANNEL);
                const msg: any = null;
                await ServersUpdate(msg, hclient, client)
            }
        }, parseFloat(process.env.SERVER_METRICS_PERIOD) * 60000);
    }

});

import CommandListener from './Commands/CommandListener'
const CmdListener = CommandListener.init(client, hclient);
if(CmdListener.status) Logger.info(CmdListener.text as string);

client.login(process.env.DISCORD_TOKEN);