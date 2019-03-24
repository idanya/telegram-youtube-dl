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
    private audioDownload(input: CommandHandlerInput): Promise<HandlerResponse> {
        return new Promise((res, rej) => {
            const segments = input.text.split(' ');

            if (!this.validateCommand(segments)) {
                res(CreateSendMessageRequest("invalid command"));
                return;
            }

            if (input.progressListener !== undefined) {
                input.progressListener(CreateSendMessageRequest("Downloading..."));
            }

            try {
                this.downloader.downloadAudioFile(segments[1], this.tempDir)
                    .then(path => {
                        res(CreateUploadAudioRequest(path, path));
                        if (fs.existsSync(path)) {
                            fs.unlinkSync(path);
                        }
                    }).catch((error: Error) => {
                        res(CreateSendMessageRequest(error.message));
                    });
            } catch (error) {
                res(CreateSendMessageRequest(error.message));
            }
        });
    }
}