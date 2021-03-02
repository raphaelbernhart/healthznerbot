import { Channel, Client, TextChannel } from 'discord.js'

import StatusUpdate from '../Worker/StatusUpdate'

export default function StatusCommand(msg: any, hclient: any) {
    // Status Update Channel
    if(msg.channel.id == process.env.DISCORD_CHANNEL && msg.content === "!status") {
        StatusUpdate(msg.channel, hclient, "Alle Server sind online!");
    }
}