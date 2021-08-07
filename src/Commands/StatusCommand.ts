import { Channel, Client, TextChannel } from 'discord.js'

import StatusUpdate from '../Worker/StatusUpdate'
import de from '../lang/de'
import en from '../lang/en'

export default function StatusCommand(msg: any, hclient: any) {
    // Status Update Channel
    if(msg.channel.id == process.env.DISCORD_CHANNEL && msg.content === '!status') {
        if (process.env.LANGUAGE === 'de') StatusUpdate(msg.channel, hclient, de.status.success);
        else if (process.env.LANGUAGE === 'en') StatusUpdate(msg.channel, hclient, en.status.success);
    }
}