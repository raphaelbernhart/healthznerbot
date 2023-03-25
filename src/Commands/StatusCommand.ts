import { Channel, Client, TextChannel } from "discord.js";

import StatusUpdate from "../worker/StatusUpdate";
import de from "../lang/de";
import en from "../lang/en";

// new SlashCommandBuilder();

export function StatusCommand(msg: any, hclient: any, client: any) {
    // Status Update Channel
    if (process.env.LANGUAGE === "de")
        StatusUpdate(msg.channel, hclient, de.status.success);
    else if (process.env.LANGUAGE === "en")
        StatusUpdate(msg.channel, hclient, en.status.success);
}

export const StatusCommandString: Array<string> = ["status"];
