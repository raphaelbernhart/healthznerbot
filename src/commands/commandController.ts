import { Interaction } from "discord.js";
import statusCommandHandler from "./status";
import serversCommandHandler from "./servers";

export const commands = [
    {
        name: "status",
        description: "Get the current status of servers",
    },
    {
        name: "servers",
        description:
            "Lists all Servers in a project including information like cpu and network workload and IP's",
    },
    {
        name: "metrics",
        description:
            "Lists all Servers in a project including information like cpu and network workload and IP's",
    },
];

export default (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case "status":
            statusCommandHandler(interaction);
            break;
        case "servers":
        case "metrics":
            serversCommandHandler(interaction);
            break;
    }
};
