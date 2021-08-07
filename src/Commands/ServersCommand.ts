import Discord, { Channel } from 'discord.js'
import axios from 'axios'

import ServersUpdate from '../Worker/ServersUpdate'

export default async function ServersCommand(msg: any, hclient: any) {
    if(msg.channel.id == process.env.DISCORD_CHANNEL && msg.content === "!servers") {
        await ServersUpdate(msg, hclient)
    }
}