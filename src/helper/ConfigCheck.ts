import consola from "consola";
import { configCheckErrorTag } from "../constants/log";

export const languageCheck = (): boolean => {
    const langEnv = process.env.LANGUAGE;
    if (
        !langEnv ||
        langEnv.length < 2 ||
        (langEnv !== "de" && langEnv !== "en")
    ) {
        consola.error(`${configCheckErrorTag} Language env is invalid`);
        return false;
    }

    return true;
};

export const discordCheck = (): boolean => {
    const discordEnvKeys = [
        "DISCORD_TOKEN",
        "DISCORD_CHANNEL",
        "DISCORD_CLIENT_ID",
        "DISCORD_GUILD_ID",
    ];

    const discordEnv = Object.fromEntries(
        Object.entries(process.env).filter((entry) =>
            entry[0].includes("DISCORD_")
        )
    );

    // Check if any key is nullish or empty string
    if (
        discordEnvKeys.some((key) => {
            const env = discordEnv[key];
            const isFalsy =
                typeof env === "undefined" ||
                env === null ||
                (typeof env === "string" && env.trim().length === 0);

            if (isFalsy) {
                consola.error(
                    `${configCheckErrorTag} ${key} variable for discord is invalid`
                );
            }

            return isFalsy;
        })
    ) {
        return false;
    }

    return true;
};

export const hetznerCheck = (): boolean => {
    const hetznerEnv = [];

    for (let i = 1; i < 100; i++) {
        const envVar = process.env?.[`HETZNER_TOKEN_${i}`];

        if (typeof envVar === "undefined") continue;

        hetznerEnv.push(envVar);
    }

    if (hetznerEnv.some((envVar) => !envVar?.length)) {
        console.error(
            `${configCheckErrorTag} Some env variable for hetzner is invalid`
        );
        return false;
    }
    return true;
};

export const intervalCheck = (): boolean => {
    const statusUpdateInterval = process.env.STATUS_UPDATE_INTERVAL;
    const serverMetricsPeriod = process.env.SERVER_METRICS_PERIOD;

    if (
        typeof statusUpdateInterval === "undefined" ||
        typeof serverMetricsPeriod === "undefined"
    ) {
        consola.error(
            `${configCheckErrorTag} Status update interval or server metrics period env variable not set`
        );
        return false;
    }

    if (parseFloat(statusUpdateInterval) <= 0) {
        consola.error(
            `${configCheckErrorTag} Status update interval env variable invalid`
        );
        return false;
    }

    if (parseFloat(serverMetricsPeriod) <= 0) {
        consola.error(
            `${configCheckErrorTag} Server metrics period env variable invalid`
        );
        return false;
    }

    return true;
};

export default (): void => {
    const lang = languageCheck();
    const discord = discordCheck();
    const hetzner = hetznerCheck();
    const intverval = intervalCheck();

    if (!lang || !discord || !hetzner || !intverval) {
        process.exit(1);
    }
};
