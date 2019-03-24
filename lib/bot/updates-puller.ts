import { TelegramAPI } from "telegram/api";
import { TelegramMessage, GetUpdatesResponse } from "telegram/entities/responses/get-updates";
import { GetUpdatesRequest } from "telegram/entities/requests/get-updates";

export class UpdatesPuller {
    private api: TelegramAPI
    constructor(api: TelegramAPI) {
        this.api = api;
    }

    public getUpdates(callback: (TelegramMessage) => void) {
        let request: GetUpdatesRequest = {
            timeout: 30
        };

        const runBlocking = async () => {
            while (true) {
                try {
                    let response = await this.api.getUpdates(request)
                    if (response.ok) {
                        response.result.forEach(update => {
                            request.offset = update.update_id + 1
                            if (update.message) {
                                callback(update.message)
                            }
                        });
                    }
                } catch (error) {
                    console.log("failed to get updates: " + error);
                }
            }
        }

        runBlocking();
    }
}