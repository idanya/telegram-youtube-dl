
import { GetUpdatesRequest } from "telegram/entities/requests/get-updates";
import { TelegramAPI } from "telegram/api";
import { testConditional } from "../config";

const API_TOKEN = process.env.TELEGRAM_TOKEN;

describe("Telegram api integration tests", () => {
    testConditional("should return myself", (done) => {
        const api = new TelegramAPI(API_TOKEN);
        api.getMe().then((response) => {
            expect(response.result.id).toBe(847083413);
            expect(response.result.is_bot).toBe(true);
            done();
        });
    });

    
    testConditional("should return error", (done) => {
        const api = new TelegramAPI(API_TOKEN + "1");
        api.getMe()
        .then((response) => {            
        })
        .catch(error => {
            expect(error).toBeDefined();
            done();
        });
    });

    testConditional("should get updates", (done) => {
        const api = new TelegramAPI(API_TOKEN);
        const request: GetUpdatesRequest = {
            limit: 1
        };
        api.getUpdates(request).then((response) => {
            expect(response.ok).toBe(true);            
            done();
        });
    });

    // testConditional("should send a message to all pending updates", (done) => {
    //     const api = new TelegramAPI(API_TOKEN);

    //     const request: GetUpdatesRequest = {
    //         limit: 1
    //     };
    //     api.getUpdates(request)
    //         .then((response) => {
    //             response.result.forEach(update => {
    //                 if (update.message != null) {
    //                     const sendMessageRequest: SendMessageRequest = {
    //                         chat_id: update.message.chat.id,
    //                         text: "hi"
    //                     };

    //                     api.sendMessage(sendMessageRequest).then((response) => {
    //                         expect(response.ok).toBe(true);              
    //                         done();              
    //                     });
    //                 }
    //             })
    //         });
    // });
});