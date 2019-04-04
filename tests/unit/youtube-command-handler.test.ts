import * as path from 'path';
import { YoutubeCommandHandler, DOWNLOADING_CONFIRM_MESSAGE } from "commands/youtube";
import { CommandHandlerInput, HandlerResponse } from "domain/command-handlers";
import { SendMessageRequest } from "telegram/entities/requests/send-messages";
import { TelegramUser } from "telegram/entities/responses/get-updates";
import { RemoteDownloader, AudioMetadata } from "adapters/downloader";
import { mock, instance, when } from "ts-mockito";
import * as fs from 'fs';

const tempDownloadDir = path.join(__dirname, 'downloadTemp');

class fakeDownloader implements RemoteDownloader {
    downloadAudioFile(url: string): Promise<AudioMetadata> {
        throw new Error("Method not implemented.");
    }
}

describe("test YoutubeCommandHandler", () => {

    let fromUser: TelegramUser = {
        first_name: "test",
        id: 666,
        is_bot: false,
        last_name: "test",
        username: "test"
    }

    function initUser(): void {
        fromUser = {
            first_name: "test",
            id: 666,
            is_bot: false,
            last_name: "test",
            username: "test"
        }
    }

    beforeEach(() => {
        let mockedRemoteDownloader: RemoteDownloader = mock(fakeDownloader);
        
        when(mockedRemoteDownloader.downloadAudioFile("http://www.youtube.com/watch?v=A02s8omM_hI"))
            .thenResolve(new AudioMetadata(fs.createReadStream(__filename), "filename"));
        let remoteDownloader: RemoteDownloader = instance(mockedRemoteDownloader);

        this.handler = new YoutubeCommandHandler(remoteDownloader);
        initUser();
    });

    function validateTextResponse(response: HandlerResponse, message: string) {
        expect(response.getOutputType()).toEqual("TextMessage");
        const request: SendMessageRequest = response.getOutputRequest();
        expect(request.text).toBe(message);
    }

    it("test invalid command", (done) => {
        const command: CommandHandlerInput = {
            from: fromUser,
            text: "/audio"
        };

        this.handler.AudioDownload(command)
            .then(response => {
                validateTextResponse(response, "invalid command");
                done();
            })
            .catch(error => {
                fail("should not get here: err: " + error);
            })
    });

    it("test valid command", async () => {
        const command: CommandHandlerInput = {
            from: fromUser,
            text: "/audio http://www.youtube.com/watch?v=A02s8omM_hI",
            progressListener: (progress: HandlerResponse) => {
                validateTextResponse(progress, DOWNLOADING_CONFIRM_MESSAGE);
            }
        };

        const response = await this.handler.AudioDownload(command);
        expect(response.getOutputType()).toEqual("AudioMessage");
    });

    it("test invalid url", async () => {
        const command: CommandHandlerInput = {
            from: fromUser,
            text: "/audio http://www.youtube.com/watch?v=nosuchthing",
            progressListener: (progress: HandlerResponse) => {
                validateTextResponse(progress, DOWNLOADING_CONFIRM_MESSAGE);
            }
        };

        const response = await this.handler.AudioDownload(command);
        expect(response.getOutputType()).toEqual("TextMessage");            
    });

});
