import { CommandHandlerInput, HandlerResponse, CreateUploadAudioRequest, CreateSendMessageRequest } from "domain/command-handlers";
import * as fs from "fs";
import { BotCommandHandler } from "domain/bot-commands";
import { RemoteDownloader } from "adapters/downloader";

export class YoutubeCommandHandler {
    private downloader: RemoteDownloader;
    private tempDir: string;
    constructor(tempDir: string, downloader: RemoteDownloader) {
        this.downloader = downloader;
        this.tempDir = tempDir;
    }

    private validateCommand(segments: string[]): boolean {
        return segments.length == 2 && segments[0] == "/audio";
    }

    public AudioDownload: BotCommandHandler = this.audioDownload.bind(this);
    private async audioDownload(input: CommandHandlerInput): Promise<HandlerResponse> {
        const segments = input.text.split(' ');

        if (!this.validateCommand(segments)) {
            return CreateSendMessageRequest("invalid command");
            return;
        }

        if (input.progressListener !== undefined) {
            input.progressListener(CreateSendMessageRequest("Downloading..."));
        }

        try {
            let audio = await this.downloader.downloadAudioFile(segments[1]);
            return CreateUploadAudioRequest(audio.readableStream, audio.filename, "Here you go :)");
        } catch (error) {
            return CreateSendMessageRequest(error.message);
        }
    }
}