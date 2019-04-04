import nock = require("nock");
import { TelegramAPI } from "telegram/api";
import { UpdatesPuller } from "bot/updates-puller";
import { TelegramMessage } from "telegram/entities/responses/get-updates";

const API_HOST = "https://api.telegram.org";
const FAKE_TOKEN = "-token-";

describe("test updates puller", () => {
    let puller: UpdatesPuller;

    it("test getting updates", (done) => {
        expect.assertions(1);

        const telegramApi = new TelegramAPI(FAKE_TOKEN);
        puller = new UpdatesPuller(telegramApi, ((message: TelegramMessage) => {
            expect(message.text).toBe("test");
            done();
            return true;
        }));

        nock(API_HOST)
            .filteringRequestBody(body => '*')
            .persist()
            .post(`/bot${FAKE_TOKEN}/getUpdates`, "*")
            .reply(200, {
                ok: true,
                result: [{
                    update_id: 0,
                    message: {
                        message_id: 0,
                        text: "test"
                    }
                }],
            });

        puller.getUpdates();
    });
});