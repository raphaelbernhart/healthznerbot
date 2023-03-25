import Discord, {
    Client,
    ColorResolvable,
    Message,
    TextChannel,
} from "discord.js";
import axios from "axios";

import Logger from "../helper/Logger";
import de from "../lang/de";
import en from "../lang/en";

const getApiKeys = (): Array<string> => {
    let i = 1;
    let currentHToken: string = process.env[`HETZNER_TOKEN_${i}`] || "";
    const tokenArray: Array<string> = [];

    while (currentHToken !== undefined) {
        i++;

        tokenArray.push(currentHToken);

        // Update current Token
        currentHToken = process.env[`HETZNER_TOKEN_${i}`] || "";
    }

    return tokenArray;
};

export default async function ServersUpdate(
    msg: Message,
    HCloudClients: Array<HetznerClient>,
    client: Client
): Promise<any> {
    let channel = <TextChannel>(
        client.channels.cache.get(process.env.DISCORD_CHANNEL || "")
    );
    let noPrivateNetworkText: string;
    if (process.env.LANGUAGE === "de")
        noPrivateNetworkText = de.metrics.noPrivateNet;
    else noPrivateNetworkText = en.metrics.noPrivateNet;

    try {
        const hTokens = getApiKeys();

        // Loop over Projects
        for (let i = 0; i < hTokens.length; i++) {
            const token = hTokens[i];

            const projServersRes = await axios.get(
                `https://api.hetzner.cloud/v1/servers`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const servers = projServersRes.data.servers;

            for (let i = 0; i < servers.length; i++) {
                const server = servers[i];

                const id = server.id;
                const startDate = new Date(
                    (new Date() as any) -
                        parseFloat(process.env.SERVER_METRICS_PERIOD || "0") *
                            60000
                ).toISOString();
                const endDate = new Date().toISOString();
                const imageName = server.image.name;
                const privateNet =
                    server.private_net.length >= 1
                        ? server.private_net[0].network
                        : false;

                let resNetwork;

                if (server.private_net.length >= 1) {
                    resNetwork = await axios.get(
                        `https://api.hetzner.cloud/v1/networks/${privateNet}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                }

                const privateNetName = privateNet
                    ? resNetwork?.data.network.name
                    : noPrivateNetworkText;

                let cpuAverage: number;
                let networkInAverage: number;
                let networkOutAverage: number;

                // Get Server Metrics
                const resMetrics = await axios.get(
                    `https://api.hetzner.cloud/v1/servers/${id}/metrics?type=cpu,network&start=${startDate}&end=${endDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const metrics = resMetrics.data.metrics;
                const ts = metrics.time_series;
                const cpuValues = ts.cpu.values;
                const netInValues = ts["network.0.bandwidth.in"].values;
                const netOutValues = ts["network.0.bandwidth.out"].values;

                const cpuLength = cpuValues.length;
                cpuAverage =
                    cpuValues
                        .map((_: string[]) => parseFloat(_[1]))
                        .reduce((a: any, b: any) => a + b, 0) / cpuLength;
                const netInLength = cpuValues.length;
                networkInAverage =
                    netInValues
                        .map((_: string[]) => parseFloat(_[1]))
                        .reduce((a: any, b: any) => a + b, 0) / netInLength;
                const netOutLength = cpuValues.length;
                networkOutAverage =
                    netOutValues
                        .map((_: string[]) => parseFloat(_[1]))
                        .reduce((a: any, b: any) => a + b, 0) / netOutLength;

                let serverRes: Record<string, any> = {
                    name: server.name,
                    status: server.status,
                    publicIp: server.public_net.ipv4.ip,
                    privateIp: server.private_net[0]
                        ? server.private_net[0].ip
                        : noPrivateNetworkText,
                    metrics: {
                        cpu: cpuAverage,
                        netIn: networkInAverage,
                        netOut: networkOutAverage,
                    },
                };

                let color: ColorResolvable = "#FFB762";
                if (serverRes.status === "running") color = "#62FFAA";
                else if (serverRes.status === "off") color = "#FF6262";
                else color = "#FFB762";

                const msg = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(serverRes.name)
                    .setURL("https://github.com/raphaelbernhart/healthznerbot")
                    .setAuthor(
                        "Healthzner Bot",
                        "https://www.hetzner.de/themes/hetzner/images/favicons/xapple-touch-icon.png.pagespeed.ic.GLhiiPCLIN.png",
                        "https://github.com/raphaelbernhart/healthznerbot"
                    )
                    .addFields(
                        { name: "Server Name", value: serverRes.name },
                        { name: "Image", value: imageName },
                        { name: "Status", value: serverRes.status },
                        { name: "Public IP", value: serverRes.publicIp },
                        { name: "Private IP", value: serverRes.privateIp },
                        { name: "Network", value: privateNetName },
                        { name: "\u200B", value: "\u200B" },
                        {
                            name: "CPU",
                            value: `${parseInt(serverRes.metrics.cpu)}%`,
                            inline: true,
                        },
                        {
                            name: "Network In",
                            value: `${
                                parseInt(serverRes.metrics.netIn) / 1000
                            } Kb/s`,
                            inline: true,
                        },
                        {
                            name: "Network Out",
                            value: `${
                                parseInt(serverRes.metrics.netOut) / 1000
                            } Kb/s`,
                            inline: true,
                        }
                    )
                    .setTimestamp()
                    .setFooter(
                        "Healthzner Bot",
                        "https://github.com/raphaelbernhart/healthznerbot"
                    );

                console.log(msg);

                channel.send(msg as any);
            }
        }
    } catch (err: any) {
        Logger.error(err);
    }
}
