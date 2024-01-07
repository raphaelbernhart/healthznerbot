import hcloud from "hcloud-js";
import consola from "consola";
import { hetznerErrorTag } from "../constants/log";
import axios from "axios";

interface fetchServerMetricsOptions {
    serverId: number;
    startDate: string;
    endDate: string;
    token: {
        key: string;
        value: string;
    };
}

export default class HetznerCloud {
    static hCloudClients: Array<HetznerClient>;

    constructor(clients: Array<HetznerClient>) {
        HetznerCloud.hCloudClients = clients;

        // Test HCloud Client
        HetznerCloud.hCloudClients.forEach((client: HetznerClient) => {
            client.servers.list().catch((err: any) => {
                if (!err) return;

                if (err.code === "unauthorized") {
                    consola.error(
                        `${hetznerErrorTag} Could not authenticate token '${client.hCloudToken.name}'`
                    );
                } else {
                    consola.error(`${hetznerErrorTag} ${err.message}`);
                }
                process.exit(1);
            });
        });
    }

    static async initHCloud() {
        let i = 1;
        let currentHToken: string = process.env[`HETZNER_TOKEN_${i}`] || "";
        const ClientsArray: Array<HetznerClient> = [];

        while (currentHToken) {
            i++;

            ClientsArray.push({
                ...(await this.initSingleHCloudClient(currentHToken)),
                hCloudToken: {
                    token: currentHToken,
                    name: `HETZNER_TOKEN_${i - 1}`,
                },
            });

            // Update current Token
            currentHToken = process.env[`HETZNER_TOKEN_${i}`] || "";
        }

        await Promise.all(ClientsArray);

        globalThis.$hcloud = ClientsArray;

        return new HetznerCloud(ClientsArray);
    }

    static async initSingleHCloudClient(token: string) {
        try {
            // "yMwNq6qViw7oJs1Bm1UkBRHO8KFHggjSDKx0N64K8VW0SvkNrESCDOjs3qoDQ0Qw"
            const client = await new hcloud.Client(token);
            return client;
        } catch (err: any) {
            consola.error(`${hetznerErrorTag} ${err.message}`);
            process.exit(1);
        }
    }
}

export async function fetchServerMetrics(options: fetchServerMetricsOptions) {
    try {
        return await axios.get(
            `https://api.hetzner.cloud/v1/servers/${options.serverId}/metrics?type=cpu,network&start=${options.startDate}&end=${options.endDate}`,
            {
                headers: {
                    Authorization: `Bearer ${options.token.value}`,
                },
            }
        );
    } catch (err: any) {
        consola.error(
            `[Hetzner] Metrics request failed for token ${options.token.key}\nStatus: ${err.response.status}\nCode: ${err.code}`
        );
    }
}
