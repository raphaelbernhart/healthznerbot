import Discord, { Channel, TextChannel } from 'discord.js';
const client = new Discord.Client();

import dotenv from 'dotenv';
dotenv.config();

const Cloud = require('hetzner-cloud-api');
const hclient = new Cloud(process.env.HETZNER_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

import CommandListener from './Commands/CommandListener'
const CmdListener = CommandListener.init(client, hclient);
if(CmdListener.status) console.log(CmdListener.text);

// client.channels.cache.find(channel => channel.!name === "channelname");

import StatusUpdate from './Worker/StatusUpdate'
if(typeof process.env.STATUS_UPDATE_INTERVAL === "number") {
    setInterval(() => {
        // StatusUpdate(channel, hclient);
        console.log(client.channels);
    }, process.env.STATUS_UPDATE_INTERVAL * 3600000);
}

client.login(process.env.DISCORD_TOKEN);