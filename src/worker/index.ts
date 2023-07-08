import consola from "consola";
import { Client } from "discord.js";
import statusWorker from "./status";

export class CommandInterval {
    interval: number;

    constructor(callback: Function, intervalDuration: number, name: string) {
        consola.info(`Registering ${name} command worker`);

        this.interval = setInterval(callback, intervalDuration);

        consola.info(`Finished registering of ${name} command worker`);
    }
}

export default (client: Client) => {
    statusWorker(client);
};
