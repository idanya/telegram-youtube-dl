
import { GetUpdatesRequest } from "telegram/entities/requests/get-updates";
import { TelegramAPI } from "telegram/api";

const API_TOKEN = process.env.TELEGRAM_TOKEN;

describe.skip("Telegram api integration tests", () => {
    it("should return myself", (done) => {
        const api = new TelegramAPI(API_TOKEN);
        api.getMe().then((response) => {
            expect(response.result.id).toBe(847083413);
            expect(response.result.is_bot).toBe(true);
            done();
        });
    });

    
    it("should return error", (done) => {
        const api = new TelegramAPI(API_TOKEN + "1");
        api.getMe()
        .then((response) => {            
        })
        .catch(error => {
            expect(error).toBeDefined();
            done();
        });
    });

    it("should get updates", (done) => {
        const api = new TelegramAPI(API_TOKEN);
        const request: GetUpdatesRequest = {
            limit: 1
        };
        api.getUpdates(request).then((response) => {
            expect(response.ok).toBe(true);            
            done();
        });
    });
});