import { TelegramUser } from "telegram/entities/responses/get-updates";
import { CommandHandlerInput, HandlerResponse, CreateSendMessageRequest } from "domain/command-handlers";

const startMessageBody = (from: TelegramUser): string => {
    return `*Hey ${from.first_name}*

I am here to help you download audio and video files from the web.
Currently, working only with youtube.
Try /help to see available commands.`;
};


function startHandler(input: CommandHandlerInput): Promise<HandlerResponse> {
    return Promise.resolve(CreateSendMessageRequest(startMessageBody(input.from)));
}

export { startHandler };