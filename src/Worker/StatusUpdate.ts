import { TextChannel } from "discord.js";

function arrayEquals(a: any, b: any) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

export default async function StatusCommand(channel: TextChannel, hclient: any, allOnlineMessage?: string, lastUpdate?: Array<number> | boolean): Promise<Array<number> | boolean> {

    return await hclient.getServers().then(async (res: any): Promise<Array<number> | boolean> => {
        const servers = res.servers;
        let allOnline = true;
        let message: Array<any> = [];
        let stoppedServers: Array<number> = [];

        // Check if any server isn't online
        servers.forEach((server: any) => {
            const status = server.status;
            if(status != "running") {
                // if(message.length > 0) message.push("\n");
                message.push(`❌ Server **${server.name}**(${server.public_net.ipv4.ip}) ist momentan offline.`);
                stoppedServers.push(server.id);
                allOnline = false;
            }
        });

        if(allOnline) {
            if(allOnlineMessage) {
                channel.send(allOnlineMessage);
                return true;
            }
        }
        else {
            if(!arrayEquals(lastUpdate, stoppedServers)) {
                channel.send(message);
            }
            return stoppedServers;
        };
    });
}