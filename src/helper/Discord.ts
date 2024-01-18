import consola from "consola";
import { Client } from "discord.js";

export const getLastMessages = async (client: Client, limit: number = 5) => {
    const channelId = process.env.DISCORD_CHANNEL as string;
    const channel = await client.channels.fetch(channelId);

    if (!channel?.isTextBased()) {
        consola.error(
            "Status update could not be sent. The specified channel (CHANNEL_ID env variable) is not a text channel"
        );
        return;
    }

    try {
        return channel.messages.fetch({ limit });
    } catch (err) {
        consola.error(err);
    }
};

export const getLastMessageOfBot = async (client: Client) => {
    try {
        const messages = await getLastMessages(client);

        if (!messages) return;

        return messages
            ?.filter((message) => message.author.id === client.user?.id)
            .first();
    } catch (err) {
        consola.error(err);
    }
};
