import { Channel, Client, TextChannel } from 'discord.js'

import StatusUpdate from '../Worker/StatusUpdate'

export default class CommandListener {
    static init(client: Client, hclient: any): Record<string, string|number> {

        try {
            client.on("message", msg => {
                if(msg.channel.type === "text") {
                    // Status Update Channel
                    if(msg.channel.name == process.env.DISCORD_CHANNEL && msg.content === "!status") {
                        StatusUpdate(msg.channel, hclient);
                    }
                }
            });
        } catch(err) {
            console.log(err);
            return {
                status: 0,
                text: "Command Listener could not be initialized"
            };
        }
        return {
            status: 1,
            text: "Command Listener initialized"
        };
    }

    static disable(client: Client): Record<string, string|number> {
        
        const Listener: any = client.listeners("message");

        let remove;
        Listener.forEach((l: any) => {
            remove = client.removeListener("message", l);
        });

        if(remove) return {
            status: 1,
            text: "Command Listener disabled"
        }; else return {
            status: 0,
            text: "Command Listener could not be disabled"
        }
    }
}