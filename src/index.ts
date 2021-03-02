import Discord, { Channel, TextChannel } from 'discord.js';
const client = new Discord.Client();

import dotenv from 'dotenv';
dotenv.config();

const Cloud = require('hetzner-cloud-api');
const hclient = new Cloud(process.env.HETZNER_TOKEN);

import StatusUpdate from './Worker/StatusUpdate'

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    let lastUpdate: Array<number> | boolean;

    setInterval(async () => {
        let channel: Channel = client.channels.cache.get(process.env.DISCORD_CHANNEL);
        if(channel.type == "text") {
            let channel = <TextChannel> client.channels.cache.get(process.env.DISCORD_CHANNEL);
            lastUpdate = await StatusUpdate(channel, hclient, undefined, lastUpdate);
        }
    }, parseFloat(process.env.STATUS_UPDATE_INTERVAL) * 60000);

});

import CommandListener from './Commands/CommandListener'
const CmdListener = CommandListener.init(client, hclient);
if(CmdListener.status) console.log(CmdListener.text);

client.login(process.env.DISCORD_TOKEN);