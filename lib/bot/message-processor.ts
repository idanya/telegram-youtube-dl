import { TelegramMessage } from "telegram/entities/responses/get-updates";
import { TelegramAPI } from "telegram/api";
import { BotCommands } from "domain/bot-commands";
import { CommandHandlerInput, HandlerResponse } from "domain/command-handlers";
import { SendMessageRequest } from "telegram/entities/requests/send-messages";
import { UploadAudioRequest } from "telegram/entities/requests/send-messages";
import { TelegramResponse } from "telegram/entities/responses/response";

export class MessageProcessor {
    private api: TelegramAPI;
    private commands: BotCommands;

    constructor(api: TelegramAPI, commands: BotCommands) {
        this.api = api;
        this.commands = commands;
    }

    private handleMessageReply(message: TelegramMessage, request: SendMessageRequest) {
        this.logHandledResponse(this.api.sendMessage(request));
    }

    private handleMessageReplyWithAudio(message: TelegramMessage, request: UploadAudioRequest) {
        this.logHandledResponse(this.api.sendAudio(request));
    }

    private logHandledResponse(response: Promise<TelegramResponse<TelegramMessage>>) {
        response
            .then((response) => {
                console.log(`sent response to user. msg id ${response.result.message_id}`);
            })
            .catch((error) => {
                console.log(`failed to send response: ${error}`);
            });
    }

    private handleReponse(message: TelegramMessage, response: HandlerResponse) {
        let request = response.getOutputRequest();
        request.chat_id = message.chat.id;

        switch (response.getOutputType()) {
            case 'TextMessage':
                this.handleMessageReply(message, request);
                break;           
            case 'AudioMessage':
                this.handleMessageReplyWithAudio(message, request);
                break
            default:
                console.log("failed to handle response. Unknown response type: " + response.getOutputType());
                break;
        }
    }

    public Process(message: TelegramMessage): void {
        console.log(`Got message from ${message.from.username} - ${message.text}`);

        const commandHandler = this.commands.getCommandHandler(message.text);
        if (commandHandler != null) {
            const input: CommandHandlerInput = this.generateInput(message);

            commandHandler(input)
                .then((handlerResponse) => {
                    console.log('got handler response: ' + handlerResponse.getOutputRequest());
                    this.handleReponse(message, handlerResponse);
                })
                .catch(error => {
                    console.log("failed to process command: " + error);
                });
        }
    }

    private generateInput(message: TelegramMessage): CommandHandlerInput {
        return {
            from: message.from,
            text: message.text,
            progressListener: (progressResponse: HandlerResponse) => {
                this.handleReponse(message, progressResponse);
            }
        };
    }
}