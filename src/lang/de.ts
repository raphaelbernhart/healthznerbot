const lang = {
    status: {
        failed: (server: Record<string, any>) => {
            return `❌ Server **${server.name}**(${server.publicNet.ipv4.ip}) ist momentan offline.`;
        },
        success: "🟢 Alle Server sind online!",
    },
    metrics: {
        noPrivateNet: "Kein privates Netzwerk vorhanden",
    },
};

export default lang;
