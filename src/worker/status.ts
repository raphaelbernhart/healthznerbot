import consola from "consola";
import dayjs from "dayjs";
import { Client } from "discord.js";
import { CommandInterval } from ".";
import { getStatus } from "../commands/status";

export default (client: Client) => {
    let lastStatus: string;

    const callback = async () => {
        const status = await getStatus();

        const channelId = process.env.DISCORD_CHANNEL;

        if (!channelId) {
            consola.error("Channel id env variable is not defined");
            process.exit(1);
        }

        const channel = await client.channels.fetch(channelId);
        if (!channel?.isTextBased()) {
            consola.error(
                "Status update could not be sent. The specified channel (CHANNEL_ID env variable) is not a text channel"
            );
            return;
        }

        if (lastStatus === status) {
            consola.debug(
                "Status is the same since the last time. Status update not sent."
            );
            return;
        }
        lastStatus = status;

        channel.send(status);
        consola.debug("Status update sent");
    };

    const intervalDuration = process.env.STATUS_UPDATE_INTERVAL;

    if (intervalDuration === null || typeof intervalDuration === "undefined") {
        consola.error("Status interval duration env variable is not defined");
        process.exit(1);
    }

    const interval = new CommandInterval(
        callback,
        dayjs
            .duration({ minutes: parseFloat(intervalDuration) })
            .asMilliseconds(),
        "Status"
    );
};
