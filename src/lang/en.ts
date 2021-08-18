const lang = {
    status: {
        failed: (server: Record<string, any>) => { return `❌ Server **${server.name}**(${server.public_net.ipv4.ip}) is offline at the moment.` },
        success: 'All servers are online!'
    },
    metrics: {
        noPrivateNet: 'No private network'
    }
}

export default lang