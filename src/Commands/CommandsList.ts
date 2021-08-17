import { ServersCommand, ServersCommandString } from "./ServersCommand";
import { StatusCommand, StatusCommandString } from "./StatusCommand";

const commands: Array<ICommand> = [
    {
        command: ServersCommand,
        functionString: ServersCommandString
    },
    {
        command: StatusCommand,
        functionString: StatusCommandString
    }
]

export interface ICommand {
    command: Function,
    functionString: Array<string>
}

export default commands