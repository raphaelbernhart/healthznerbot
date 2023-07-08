const lang = {
    status: {
        failed: (server: Record<string, any>) => {
            return `❌ Server **${server.name}**(${server.public_net.ipv4.ip}) ist momentan offline.`;
        },
        success: "🟢 Alle Server sind online!",
    },
    metrics: {
        noPrivateNet: "Kein privates Netzwerk vorhanden",
    },
};

export default lang;
