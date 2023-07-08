# Healthzner Bot

A discord bot to periodically get updates of the health status of your hetzner cloud machines.

## Installation

Make sure you have Docker installed and properly configured on your system before following these steps. Additionally, ensure you have the necessary permissions and access to create and configure a Discord Bot, as well as the required credentials for accessing Hetzner cloud APIs.

### Docker

1. Copy the .env.example file by running the following command in your terminal:

    ```
    wget https://raw.githubusercontent.com/raphaelbernhart/healthznerbot/main/.env.example
    ```

2. Configure the .env file with your desired settings. You can open the file using a text editor and modify the values accordingly. Ensure you provide the necessary information, such as your Discord Bot token, Hetzner cloud API credentials, and other required configuration options.
3. Once you've finished configuring the .env file, rename it to ".env". You can do this by running the following command:

    ```
    mv .env.example .env
    ```

4. Pull the Docker image for the Discord Bot by executing the following command:

    ```
    docker pull ghcr.io/raphaelbernhart/healthznerbot:latest
    ```

5. Launch the Discord Bot using Docker, specifying the .env file for configuration. Run the following command:

    ```
    docker run --env-file .env ghcr.io/raphaelbernhart/healthznerbot:latest
    ```

    This command will start the Docker container and run the Discord Bot using the provided .env file.

6. The Discord Bot will now periodically send updates of Hetzner cloud machines to the specified Discord channel.
   Also you can manually get the status with the `/status` command and the metrics/information about the servers via the `/servers` or `/metrics` command.

### Build yourself

1. Copy the project to your local machine `git clone https://github.com/raphaelbernhart/healthznerbot.git`
2. Change directory to Healthznerbot `cd healthznerbot`
3. Rename the `.env.example` to `.env` and configure it with your credentials and wishes
4. Run the command `npm i` to install the dependencies
5. Run `npm run build` to build the bot
6. Change directory to dist `cd ./dist`
7. And finally run `npm run start` to run the bot

## Commands

`!servers`/`!metrics` - Lists all Servers in a project including information like cpu and network workload and IP's</br> ![healthznerbot-ui.png](https://assets.raphaelbernhart.at/images/healthznerbot/healthznerbot-ui.png) `!status` - Get the current Status of the Servers. Returning '**Alle Server sind online!**' if all Servers are up. Returns '**:x: Server SERVERNAME(IP_ADDR) ist momentan offline.**' (English is also available)

## Configuration

The configuration is made with environment variables.

Rename the `.env.example` to `.env` and configure it with your credentials and wishes

-   `DISCORD_TOKEN`: The Discord Token which you have to generate on the Discord Developer Portal (https://discord.com/developers/applications)
-   `DISCORD_CHANNEL`: The Channel ID from the channel in which you want the bot to be
-   `HETZNER_TOKEN`: The Hetzner Cloud API Token which you have to generate on the Hetzner Cloud Console (https://docs.hetzner.cloud/#getting-started)
-   `STATUS_UPDATE_INTERVAL`: How often status updates will occure (in minutes) e.g. `2.5` = every two and a half minutes
-   `SERVER_METRICS_PERIOD`: Period to get metrics such as CPU and Network Workload (in minutes) e.g. `15` get the average workload from the last 15 minutes
-   `LANGUAGE`: Language, currently are only german and english supported (de/en)
