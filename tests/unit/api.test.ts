import { TelegramAPI } from "telegram/api";
import { SendMessageRequest, UploadAudioRequest } from "telegram/entities/requests/send-messages";
import nock = require("nock");
import { GetMeResponse } from "telegram/entities/responses/getme";
import { Stream, Readable } from "stream";

const API_HOST = "https://api.telegram.org";
const FAKE_TOKEN = "-token-";

describe("test api methods", () => {
    let telegramApi: TelegramAPI;
    beforeEach(() => {
        telegramApi = new TelegramAPI(FAKE_TOKEN);
    });
    it("test send message", (done) => {
        nock(API_HOST)
            .filteringRequestBody(body => '*')
            .post(`/bot${FAKE_TOKEN}/sendMessage`, "*")
            .reply(200, {
                ok: true,
                result: {
                    message_id: 0,
                    text: "test",
                },
            });

        const request: SendMessageRequest = {
            chat_id: 1,
            text: "test",
            parse_mode: "Markdown"
        }
        telegramApi.sendMessage(request)
            .then(response => {
                expect(response.ok).toBe(true);
                expect(response.result.text).toBe("test");
                done();
            })
    });

    it("test getme request", (done) => {
        const apiResponse: GetMeResponse = {
            first_name: "bot",
            id: 1,
            is_bot: true,
            username: "@bot"
        }
        nock(API_HOST)
            .get(`/bot${FAKE_TOKEN}/getMe`)
            .reply(200, {
                ok: true,
                result: apiResponse,
            });


        telegramApi.getMe()
            .then(response => {
                expect(response.ok).toBe(true);
                expect(response.result.first_name).toBe(apiResponse.first_name);
                expect(response.result.id).toBe(apiResponse.id);
                expect(response.result.is_bot).toBe(apiResponse.is_bot);
                expect(response.result.username).toBe(apiResponse.username);
                done();
            })
    });

    it("test send audio", (done) => {
        // TODO: need some more more, nock matching should be a lot more strict for this to actually test anything.
         nock(API_HOST, {
            reqheaders: {
                "content-type": value => value.includes("multipart/form-data; boundary=")
            }
        })
            .filteringRequestBody(body => '*')
            .post(`/bot${FAKE_TOKEN}/sendAudio`, "*")
            .reply(200, {
                ok: true,
                result: {
                    message_id: 0,
                    text: "test",
                },
            });

        let readable = new Readable();
        readable._read = () => { };
        readable.push("test data");
        readable.push(null);

        const request: UploadAudioRequest = {
            chat_id: 1,
            caption: "test",
            audio: readable,
            parse_mode: "Markdown"
        }

        telegramApi.sendAudio(request)
            .then(response => {
                expect(response.ok).toBe(true);
                expect(response.result.text).toBe("test");
                done();
            })
    });
});