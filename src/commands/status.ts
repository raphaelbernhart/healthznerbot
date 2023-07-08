import { ChatInputCommandInteraction } from "discord.js";

export const getStatus = async (): Promise<string> => {
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
    let messages: Array<any> = [];
    let stoppedServers: Array<number> = [];

    // Check if any server isn't online
    servers.forEach((server) => {
        const status = server.status;
        if (status !== "running") {
            messages.push($lang.status.failed(server));
            stoppedServers.push(server.id);
            allOnline = false;
        }
    });

    if (allOnline) {
        return $lang?.status.success;
    }
    return messages.join("\n");
};

export default async (interaction: ChatInputCommandInteraction) => {
    const message = await getStatus();

    interaction.reply(message);
};
