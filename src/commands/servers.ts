import { ChatInputCommandInteraction } from "discord.js";
import dayjs from "dayjs";
import axios from "axios";
import { fetchServerMetrics } from "../vendor/hetznerCloud";

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
            const serverMetricsPeriod = Number.parseFloat(
                process.env.SERVER_METRICS_PERIOD || "15"
            );
            const startDate = dayjs()
                .subtract(serverMetricsPeriod, "minutes")
                .toISOString();
            const endDate = dayjs().toISOString();

            const metricsResponse = await fetchServerMetrics({
                serverId,
                startDate,
                endDate,
                token: {
                    key: $hcloud[projectIndex].hCloudToken.name,
                    value: token,
                },
            });

            if (typeof metricsResponse === "undefined") {
                await interaction.reply({
                    content:
                        "An error occurred while fetching metrics from the hetzner api",
                });
                return;
            }

            // Metrics calculation
            const metrics = metricsResponse.data.metrics;
            const timeSeries = metrics.time_series;
            const cpuValues = timeSeries.cpu.values;
            const netInValues = timeSeries["network.0.bandwidth.in"].values;
            const netOutValues = timeSeries["network.0.bandwidth.out"].values;

            const cpuAverage =
                cpuValues
                    .map((_: string[]) => parseFloat(_[1]))
                    .reduce((a: any, b: any) => a + b, 0) / cpuValues.length;
            const networkInAverage =
                netInValues
                    .map((_: string[]) => parseFloat(_[1]))
                    .reduce((a: any, b: any) => a + b, 0) / netInValues.length;
            const networkOutAverage =
                netOutValues
                    .map((_: string[]) => parseFloat(_[1]))
                    .reduce((a: any, b: any) => a + b, 0) / netOutValues.length;

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
                { name: "", value: "\u200B" },
                {
                    name: "CPU",
                    value: `${Intl.NumberFormat(process.env.LANGUAGE, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(cpuAverage)}%`,
                    inline: true,
                },
                {
                    name: "Network In",
                    value: `${Intl.NumberFormat(process.env.LANGUAGE, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(networkInAverage / 1000)} Kb/s`,
                    inline: true,
                },
                {
                    name: "Network Out",
                    value: `${Intl.NumberFormat(process.env.LANGUAGE, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(networkOutAverage / 1000)} Kb/s`,
                    inline: true,
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
