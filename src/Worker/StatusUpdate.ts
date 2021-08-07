import axios from "axios";
import { TextChannel, MessageAttachment } from "discord.js";
import path from "path";

import de from '../lang/de'
import en from '../lang/en'

function arrayEquals(a: any, b: any) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}

export default async function StatusCommand(channel: TextChannel, hclient: any, allOnlineMessage?: string, lastUpdate?: Array<number> | boolean): Promise<Array<number> | boolean> {

    return await hclient.getServers().then(async (res: any): Promise<Array<number> | boolean> => {
        const servers = res.servers;
        let allOnline = true;
        let message: Array<any> = [];
        let stoppedServers: Array<number> = [];

        // Check if any server isn't online
        servers.forEach((server: any) => {
            const status = server.status;
            if(status != "running") {
                // if(message.length > 0) message.push("\n");
                if (process.env.LANGUAGE === 'de') message.push(de.status.failed(server));
                else if (process.env.LANGUAGE === 'en') message.push(en.status.failed(server));
                stoppedServers.push(server.id);
                allOnline = false;
            }
        });

        if(allOnline) {
            if(allOnlineMessage) {
                channel.send(allOnlineMessage);

                // Meme Mode
                if (process.env.MEME_MODE === 'true') {
                    const apiKey = process.env.GIPHY_API_KEY
                    const res = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=nice&rating=g`)
                    const url = res.data.data.fixed_width_downsampled_url
                    const attachment = new MessageAttachment(url);
                    const logo = new MessageAttachment(path.join(__dirname + '/../assets/giphy-logo.png'))
                    channel.send(attachment)
                    channel.send(logo)
                }
                return true;
            }
        }
        else {
            if(!arrayEquals(lastUpdate, stoppedServers)) {
                channel.send(message);
            }
            return stoppedServers;
        };
    });
}