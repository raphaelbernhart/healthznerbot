import { Interaction } from "discord.js";
import status from "./status";

export const commands = [
    {
        name: "status",
        description: "Get the server health status",
    },
];

export default (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case "status":
            status(interaction);
            break;
    }
};
