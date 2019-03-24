import { TelegramUser } from "telegram/entities/responses/get-updates";
import { SendMessageRequest, ParseMode } from "telegram/entities/requests/send-messages";
import { UploadAudioRequest } from "telegram/entities/requests/send-messages";
import * as fs from "fs";

type HandlerOutputType = 'TextMessage' | 'AudioMessage';

export interface CommandHandlerInput {
    from: TelegramUser,
    text: string
    progressListener?: (progress: HandlerResponse) => void;
}

export class HandlerResponse {
    private outputType: HandlerOutputType;
    private outputRequest: any;

    public getOutputType(): HandlerOutputType {
        return this.outputType;

    }

    public getOutputRequest(): any {
        return this.outputRequest;
    }

    public setTextMessageOutput(request: SendMessageRequest) {
        this.outputType = 'TextMessage';
        this.outputRequest = request;
    }

    public setAudioMessageOutput(request: UploadAudioRequest) {
        this.outputType = 'AudioMessage';
        this.outputRequest = request;
    }
}

export function CreateUploadAudioRequest(filePath: string, caption?: string, parse_mode: ParseMode = 'Markdown'): HandlerResponse {
    const request: UploadAudioRequest = {
        chat_id: null,
        caption: caption,
        parse_mode: parse_mode,
        audio: null
    }

    if (fs.existsSync(filePath)) {
        request.audio = fs.createReadStream(filePath)
    }

    const response = new HandlerResponse();
    response.setAudioMessageOutput(request);
    return response;
}


export function CreateSendMessageRequest(text?: string, parse_mode: ParseMode = 'Markdown'): HandlerResponse {
    const request: SendMessageRequest = {
        chat_id: null,
        parse_mode: parse_mode,
        text: text
    }

    const response = new HandlerResponse();
    response.setTextMessageOutput(request);
    return response;
}
