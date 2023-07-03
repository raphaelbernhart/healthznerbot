import hcloud from "hcloud-js";
import consola from "consola";

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
                        `[Hetzner API] Could not authenticate token '${client.hCloudToken.name}'`
                    );
                } else {
                    consola.error(`[Hetzner API] ${err.message}`);
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
            consola.error(`[Hetzner API] ${err.message}`);
            process.exit(1);
        }
    }
}
