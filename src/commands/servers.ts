import { ChatInputCommandInteraction } from "discord.js";
import dayjs from "dayjs";
import axios from "axios";

const mapServerStatusToColor = (status: string) => {
    switch (status) {
        case "initializing":
            return 10181046;
        case "running":
            return 5763719;
        case "stopping":
        case "off":
            return 15548997;
        case "starting":
        case "deleting":
        case "rebuilding":
        case "migrating":
            return 15105570;
        default:
            return 0;
    }
};

export default async (interaction: ChatInputCommandInteraction) => {
    const serverMessages = [];

    for (let projectIndex = 0; projectIndex < $hcloud.length; projectIndex++) {
        const client = $hcloud[projectIndex];
        const token = client.hCloudToken.token;

        const servers = (await client.servers.list()).servers;

        for (let serverIndex = 0; serverIndex < servers.length; serverIndex++) {
            const server = servers[serverIndex];

            // Metrics
            const serverId = server.id;
            const serverMetricsPeriod = Number.parseInt(
                process.env.SERVER_METRICS_PERIOD || "15"
            );
            const startDate = dayjs()
                .subtract(serverMetricsPeriod, "minutes")
                .toISOString();
            const endDate = dayjs().toISOString();

            const metricsResponse = await axios.get(
                `https://api.hetzner.cloud/v1/servers/${serverId}/metrics?type=cpu,network&start=${startDate}&end=${endDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const serverMessage = [
                { name: "Server Name", value: server.name },
                { name: "Image", value: server.image?.description },
                {
                    name: "Status",
                    value:
                        server.status.charAt(0).toUpperCase() +
                        server.status.slice(1),
                    legacyValue: server.status,
                },
                {
                    name: "Public IP / Private IP",
                    value: `__${server.publicNet?.ipv4?.ip}__ / __${
                        server.privateNet?.[0]
                            ? server.privateNet?.[0].ip
                            : $lang.metrics.noPrivateNet
                    }__`,
                },
            ];

            serverMessages.push(serverMessage);
        }
    }

    interaction.reply({
        embeds: serverMessages.map((serverMessage) => ({
            color: mapServerStatusToColor(
                serverMessage.find((msg) => msg.name === "Status")
                    ?.legacyValue || ""
            ),
            fields: serverMessage,
            timestamp: new Date().toISOString(),
            footer: {
                text: "Healthzner Bot",
            },
        })),
    });
};
