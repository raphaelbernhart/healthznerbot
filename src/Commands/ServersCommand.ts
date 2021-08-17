import Discord, { Channel, Client, TextChannel } from 'discord.js'
import axios from 'axios'

import ServersUpdate from '../Worker/ServersUpdate'

export async function ServersCommand(msg: any, hclient: any, client: Client) {
    let channel = <TextChannel> client.channels.cache.get(process.env.DISCORD_CHANNEL);
    await ServersUpdate(msg, hclient, client)
}

export const ServersCommandString: Array<string> = ['servers', 'metrics']