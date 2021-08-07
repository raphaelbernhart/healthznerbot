import Discord, { Channel } from 'discord.js'
import axios from 'axios'

export default async function ServersUpdate(channel: any, hclient: any): Promise<boolean> {
    
    let message: Array<any> = [];

    hclient.getServers().then((res: Record<string, any>) => {

        res.servers.forEach(async (server: Record<string, any>) => {
            const id = server.id;
            const startDate = new Date(new Date() as any - parseFloat(process.env.SERVER_METRICS_PERIOD) * 60000).toISOString();
            const endDate = new Date().toISOString();
            const imageName = server.image.name
            const privateNet = server.private_net[0].network

            const resNetwork = await axios.get(`https://api.hetzner.cloud/v1/networks/${privateNet}`, {
                headers: {
                    Authorization: `Bearer ${process.env.HETZNER_TOKEN}`
                }
            })

            const privateNetName = resNetwork.data.network.name

            let cpuAverage: number;
            let networkInAverage: number;
            let networkOutAverage: number;

            await hclient.getServerMetrics(id, `?type=cpu,network&start=${startDate}&end=${endDate}`).then(async (res: any) => {
                const metrics = res.metrics
                const ts = metrics.time_series
                const cpuValues = ts.cpu.values;
                const netInValues = ts["network.0.bandwidth.in"].values;
                const netOutValues = ts["network.0.bandwidth.out"].values;

                const cpuLength = cpuValues.length;
                cpuAverage = cpuValues.map((_: string[]) => parseFloat(_[1])).reduce((a: any, b: any) => a + b, 0) / cpuLength
                const netInLength = cpuValues.length;
                networkInAverage = netInValues.map((_: string[]) => parseFloat(_[1])).reduce((a: any, b: any) => a + b, 0) / netInLength
                const netOutLength = cpuValues.length;
                networkOutAverage = netOutValues.map((_: string[]) => parseFloat(_[1])).reduce((a: any, b: any) => a + b, 0) / netOutLength

                let serverRes: Record<any, any> = {
                    name: server.name,
                    status: server.status,
                    publicIp: server.public_net.ipv4.ip,
                    privateIp: server.private_net[0] ? server.private_net[0].ip : 'Kein privates Netzwerk',
                    metrics: {
                        cpu: cpuAverage,
                        netIn: networkInAverage,
                        netOut: networkOutAverage
                    }
                };

                let color = '#FFB762';
                if(serverRes.status === "running") color = '#62FFAA'
                else if(serverRes.status === "off") color = '#FF6262'
                else color = '#FFB762'

                const msg = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(serverRes.name)
                .setURL('https://github.com/raphaelbernhart/healthznerbot')
                .setAuthor('Healthzner Bot', 'https://www.hetzner.de/themes/hetzner/images/favicons/xapple-touch-icon.png.pagespeed.ic.GLhiiPCLIN.png', 'https://github.com/raphaelbernhart/healthznerbot')
                .addFields(
                    { name: 'Server Name', value: serverRes.name },
                    { name: 'Image', value: imageName },
                    { name: 'Status', value: serverRes.status },
                    { name: 'Public IP', value: serverRes.publicIp },
                    { name: 'Private IP', value: serverRes.privateIp },
                    { name: 'Network', value: privateNetName },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'CPU', value: `${parseInt(serverRes.metrics.cpu)}%`, inline: true },
                    { name: 'Network In', value: `${parseInt(serverRes.metrics.netIn)/1000} Kb/s`, inline: true },
                    { name: 'Network Out', value: `${parseInt(serverRes.metrics.netOut)/1000} Kb/s`, inline: true }
                )
                .setTimestamp()
                .setFooter('Healthzner Bot', 'https://github.com/raphaelbernhart/healthznerbot');

                channel.send(msg)
            })
        });
    })
    return true
}