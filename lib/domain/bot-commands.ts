import { HandlerResponse, CommandHandlerInput, CreateSendMessageRequest } from "domain/command-handlers";

export type BotCommandHandler = (input: CommandHandlerInput) => Promise<HandlerResponse>;
export interface BotCommand {
    handler: BotCommandHandler
    helpText: string
}

interface CommandsHash {
    [key: string]: BotCommand
}

export class BotCommands {
    private commands: CommandsHash = {};
        
    public addCommand(command: string, handler: BotCommand): void {        
        this.commands[command] = handler;
    }

    public getCommandHandler(command: string): BotCommandHandler {
        if (command in this.commands) {
            return this.commands[command].handler;
        }

        for(const key in this.commands){
            if (command.startsWith(key)){
                return this.commands[key].handler;
            }
        }
        
        return null;
    }

    private getHelpCommands(): string {
        let text = '';
        for (const key in this.commands) {
            text += `${key} - ${this.commands[key].helpText}\n`;
        }
        return text;
    }

    public UserHelper = this.userHelper.bind(this);
    private userHelper(input: CommandHandlerInput): Promise<HandlerResponse> {
        return new Promise<HandlerResponse>((resolve,reject)=>{
            let output = new HandlerResponse()
            const messageText = `Available Commands:\n\n${this.getHelpCommands()}`;                    
            resolve(CreateSendMessageRequest(messageText, ""));
        });
    }
        
}