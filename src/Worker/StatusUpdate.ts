import { TextChannel } from "discord.js";

export default async function StatusCommand(channel: TextChannel, hclient: any): Promise<boolean> {

    hclient.getServers().then((res: any) => {
        const servers = res.servers;
        let allOnline = true;
        let message: Array<any> = [];

        // Check if any server isn't online
        servers.forEach((server: any) => {
            const status = server.status;
            if(status != "running") {
                // if(message.length > 0) message.push("\n");
                message.push(`❌ Server **${server.name}**(${server.public_net.ipv4.ip}) ist momentan nicht online. Blöd wa.`);
                allOnline = false;
            }
        });

        if(allOnline) channel.send("Joah glaub die sind noch online...wenn nicht dann pech.");
        else {
            channel.send(message);
            return false
        };
    });

    return true;
}