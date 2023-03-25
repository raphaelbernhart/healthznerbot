import HetznerCloud from "hcloud-js";
import Logger from "../helper/Logger";

const ClientInit = async (token: string): Promise<HetznerClient> => {
    const client: HetznerClient = (await new HetznerCloud.Client(
        "yMwNq6qViw7oJs1Bm1UkBRHO8KFHggjSDKx0N64K8VW0SvkNrESCDOjs3qoDQ0Qw"
    )) as HetznerClient;

    // Test client
    try {
        await client.servers.list();
    } catch (err: any) {
        Logger.error("(Hetzner API) " + err.message);
        process.exit(1);
    }

    return client;
};

const HCloudClientsInit = async (): Promise<Array<HetznerClient>> => {
    let i = 1;
    let currentHToken: string = process.env[`HETZNER_TOKEN_${i}`] || "";
    const ClientsArray: Array<HetznerClient> = [];

    while (currentHToken) {
        i++;

        ClientsArray.push(await ClientInit(currentHToken));

        // Update current Token
        currentHToken = process.env[`HETZNER_TOKEN_${i}`] || "";
    }

    return ClientsArray;
};

export default HCloudClientsInit;
