import Discord, { Channel, TextChannel } from 'discord.js';
const client = new Discord.Client();

import dotenv from 'dotenv';
dotenv.config();

const Cloud = require('hetzner-cloud-api');
const hclient = new Cloud(process.env.HETZNER_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // client.users.fetch("290180267824644096").then(u => {
    //     u.send("MOINI").catch( err => { console.log(err) } );
    // });
});

import CommandListener from './Commands/CommandListener'
const CmdListener = CommandListener.init(client, hclient);
if(CmdListener.status) console.log(CmdListener.text);

const getToken = () => {

};

client.login(process.env.DISCORD_TOKEN);