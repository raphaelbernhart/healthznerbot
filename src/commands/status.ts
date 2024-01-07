import { ChatInputCommandInteraction, TextBasedChannel } from "discord.js";

export const getStatus = async (
    channel?: TextBasedChannel | undefined | null
): Promise<string | true> => {
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
        // Don't send status if last message was also allOnline message
        if (typeof channel !== "undefined" && channel !== null) {
            const lastFiveMessages = await channel.messages.fetch({ limit: 5 });
            if (
                lastFiveMessages.some(
                    (message) =>
                        message.client.user.id === $discordClient.user?.id &&
                        message.content.includes($lang?.status.success)
                )
            ) {
                return true;
            }
        }

        return $lang?.status.success;
    }
    return messages.join("\n");
};

export default async (interaction: ChatInputCommandInteraction) => {
    const message = await getStatus(interaction.channel);

    if (message === true) {
        interaction.reply($lang.status.success);
        return;
    }

    interaction.reply(message);
};
