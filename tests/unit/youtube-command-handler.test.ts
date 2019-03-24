import * as path from 'path';
import { YoutubeCommandHandler } from "commands/youtube";
import { CommandHandlerInput, HandlerResponse } from "domain/command-handlers";
import { SendMessageRequest } from "telegram/entities/requests/send-messages";
import { TelegramUser } from "telegram/entities/responses/get-updates";
import { RemoteDownloader } from "adapters/downloader";
import {mock, instance, when, anyString} from "ts-mockito";
import { testConditional } from '../config';


const tempDownloadDir = path.join(__dirname, 'downloadTemp');

class fakeDownloader implements RemoteDownloader {
    downloadAudioFile(url: string, outputPath: string): Promise<string> {
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
        
        when(mockedRemoteDownloader.downloadAudioFile("http://www.youtube.com/watch?v=A02s8omM_hI", anyString())).thenResolve("/aaa.mp3");
        let remoteDownloader: RemoteDownloader = instance(mockedRemoteDownloader);

        this.handler = new YoutubeCommandHandler(tempDownloadDir, remoteDownloader);                
        initUser();
    });

    function validateTextResponse(response: HandlerResponse, message: string) {
        expect(response.getOutputType()).toEqual("TextMessage");
        const request: SendMessageRequest = response.getOutputRequest();
        expect(request.text).toBe(message);
    }

    testConditional("test invalid command", (done) => {
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

    testConditional("test valid command", (done) => {
        const command: CommandHandlerInput = {
            from: fromUser,
            text: "/audio http://www.youtube.com/watch?v=A02s8omM_hI",
            progressListener: (progress: HandlerResponse) => {
                validateTextResponse(progress, "Downloading...");                
            }
        };    
        
        this.handler.AudioDownload(command)
            .then(response => {
                expect(response.getOutputType()).toEqual("AudioMessage");                
                done();
            })
            .catch(error => {
                fail("should not get here: err: " + error);
            });
    });

    testConditional("test invalid url", (done) => {
        const command: CommandHandlerInput = {
            from: fromUser,
            text: "/audio http://www.youtube.com/watch?v=nosuchthing",
            progressListener: (progress: HandlerResponse) => {
                validateTextResponse(progress, "Downloading...");                
            }
        };    
        
        this.handler.AudioDownload(command)
            .then(response => {
                expect(response.getOutputType()).toEqual("TextMessage");                
                done();
            })
            .catch(error => {
                fail("should not get here: err: " + error);
                done();
            });
    });

});
