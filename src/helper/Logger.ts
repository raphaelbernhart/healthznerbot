const prefix = `\x1b[36m[${new Date().toUTCString()}]\x1b[0m `;
const reset = '\x1b[0m';

export default class Logger {
    static info(InfoMessage: string): void {
        console.log(prefix + '\x1b[37m' + InfoMessage + reset);
    }

    static success(SuccessMessage: string): void {
        console.log(prefix + '\x1b[32m' + SuccessMessage + reset);
    }

    static error(ErrorMessage: string|Error): string|Error {
        console.error(prefix + '\x1b[31m' + ErrorMessage + reset);
        return ErrorMessage;
    }
}