import { CommandHandlerInput, HandlerResponse, CreateUploadAudioRequest, CreateSendMessageRequest } from "domain/command-handlers";
import { BotCommandHandler } from "domain/bot-commands";
import { RemoteDownloader } from "adapters/downloader";

export const DOWNLOADING_CONFIRM_MESSAGE = "I'm on it! Will send you the file when it's ready."

export class YoutubeCommandHandler {
    private downloader: RemoteDownloader;    
    constructor(downloader: RemoteDownloader) {
        this.downloader = downloader;        
    }

    private validateCommand(segments: string[]): boolean {
        return segments.length == 2 && segments[0] == "/audio";
    }

    public AudioDownload: BotCommandHandler = this.audioDownload.bind(this);
    private async audioDownload(input: CommandHandlerInput): Promise<HandlerResponse> {
        const segments = input.text.split(' ');

        if (!this.validateCommand(segments)) {
            return CreateSendMessageRequest("invalid command");            
        }

        if (input.progressListener !== undefined) {
            input.progressListener(CreateSendMessageRequest(DOWNLOADING_CONFIRM_MESSAGE));
        }

        try {
            let audio = await this.downloader.downloadAudioFile(segments[1]);
            return CreateUploadAudioRequest(audio.readableStream, audio.filename, "Here you go :)");
        } catch (error) {
            return CreateSendMessageRequest(error.message);
        }
    }
}