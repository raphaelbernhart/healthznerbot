import axios from "axios";
import { TextChannel, MessageAttachment, Message } from "discord.js";
import path from "path";
import Logger from "../helper/Logger";

import Discord from "discord.js";

import de from "../lang/de";
import en from "../lang/en";

function arrayEquals(a: any, b: any) {
    return (
        Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index])
    );
}

export default async function StatusCommand(
    channel: TextChannel,
    HCloudClients: Array<HetznerClient>,
    allOnlineMessage?: string,
    lastUpdate?: Array<number> | boolean
): Promise<Array<number> | boolean> {
    try {
        let servers: Array<Server> = [];

        for (let i = 0; i < HCloudClients.length; i++) {
            const hclient = HCloudClients[i];

            const serverList = await hclient.servers.list();
            serverList.servers.forEach((s) => {
                servers.push(s);
            });
        }

        let allOnline = true;
        let message: Array<any> = [];
        let stoppedServers: Array<number> = [];

        // Check if any server isn't online
        servers.forEach((server) => {
            const status = server.status;
            if (status != "running") {
                // if(message.length > 0) message.push("\n");
                if (process.env.LANGUAGE === "de")
                    message.push(de.status.failed(server));
                else if (process.env.LANGUAGE === "en")
                    message.push(en.status.failed(server));
                stoppedServers.push(server.id);
                allOnline = false;
            }
        });

        if (allOnline) {
            if (allOnlineMessage) {
                // Meme Mode
                if (process.env.MEME_MODE === "true") {
                    const apiKey = process.env.GIPHY_API_KEY;
                    const res = await axios.get(
                        `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=nice&rating=g`
                    );
                    const url =
                        res.data.data.images.fixed_width_downsampled.url;
                    const attachment = new MessageAttachment(url);
                    const logo = new MessageAttachment(
                        path.join(__dirname + "/../assets/giphy-logo.png")
                    );

                    // Send Discord All Online Message with Meme
                    channel
                        .send({
                            content: allOnlineMessage,
                            embed: {
                                image: { url: url },
                            },
                        })
                        .catch((err) => console.log(new Error(err)))
                        .then(() => {
                            channel.send(logo);
                        });

                    return true;
                } else {
                    // Send Discord All Online Message without Meme
                    channel
                        .send({
                            content: allOnlineMessage,
                        })
                        .catch((err) => console.log(new Error(err)));

                    return true;
                }
            }
        } else {
            if (!arrayEquals(lastUpdate, stoppedServers)) {
                channel.send(message);
            }
            return stoppedServers;
        }
    } catch (err: any) {
        Logger.error(err);
    }
}
