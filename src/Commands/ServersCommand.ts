import Discord, { Channel, Client, TextChannel } from 'discord.js'
import axios from 'axios'

import ServersUpdate from '../Worker/ServersUpdate'

export default async function ServersCommand(msg: any, hclient: any, client: Client) {
    if(msg.channel.id == process.env.DISCORD_CHANNEL && msg.content === "!servers") {
        let channel = <TextChannel> client.channels.cache.get(process.env.DISCORD_CHANNEL);
        await ServersUpdate(msg, hclient, client)
    }
}