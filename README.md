# Healthzner Bot
A discord bot to periodically get updates of the health status of your hetzner cloud machines.

## Installation
1. Copy the project to your local machine `git clone https://github.com/raphaelbernhart/healthznerbot.git`
2. Change directory to Healthznerbot `cd healthznerbot`
3. Rename the `.env.example` to `.env` and configure it with your credentials and wishes
4. Run the command `npm i` to install the dependencies
5. Run `npm run build` to build the bot
6. Change directory to dist `cd ./dist`
7. And finally run `npm run start` to run the bot

## Commands
`!servers` - Lists all Servers in a project including information like cpu and network workload and IP's</br>
![healthznerbot-ui.png](https://assets.raphaelbernhart.at/images/healthznerbot/healthznerbot-ui.png)
`!status` - Get the current Status of the Servers. Returning '**Alle Server sind online!**' if all Servers are up. Returns '**:x: Server SERVERNAME(IP_ADDR) ist momentan offline.**' (English is also available)

## Configuration
The configuration is made with environment variables.

Rename the `.env.example` to `.env` and configure it with your credentials and wishes

- `DISCORD_TOKEN`: The Discord Token which you have to generate on the Discord Developer Portal (https://discord.com/developers/applications)
- `DISCORD_CHANNEL`: The Channel ID from the channel in which you want the bot to be
- `HETZNER_TOKEN`: The Hetzner Cloud API Token which you have to generate on the Hetzner Cloud Console (https://docs.hetzner.cloud/#getting-started)
- `STATUS_UPDATE_INTERVAL`: How often status updates will occure (in minutes) e.g. `2.5` = every two and a half minutes
- `SERVER_METRICS_PERIOD`: Period to get metrics such as CPU and Network Workload (in minutes) e.g. `15` get the average workload from the last 15 minutes
- `LANGUAGE`: Language, currently are only german and english supported (de/en)
- `MEME_MODE`: If true you will get random memes on success status commands
- `GIPHY_API_KEY`: Only necessary when Meme Mode is activated (https://developers.giphy.com/dashboard/?create=true)
