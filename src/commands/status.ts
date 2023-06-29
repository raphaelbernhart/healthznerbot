import consola from "consola";
import { ChatInputCommandInteraction } from "discord.js";
import { inspect } from "util";

export default async (interaction: ChatInputCommandInteraction) => {
    let servers: Array<Server> = [];

    // Map all servers of all hcloud clients in as an array
    for (let i = 0; i < $hcloud.length; i++) {
        const hclient = $hcloud[i];

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
            message.push($lang.status.failed(server));
            stoppedServers.push(server.id);
            allOnline = false;
        }
    });

    if (allOnline) {
        interaction.reply($lang?.status.success);
        return;
    }

    // TODO Check against online servers of last update
    interaction.reply(message[0]);
};
