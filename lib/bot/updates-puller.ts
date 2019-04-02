import {TelegramAPI} from "telegram/api";
import {TelegramMessage, GetUpdatesResponse} from "telegram/entities/responses/get-updates";
import {GetUpdatesRequest} from "telegram/entities/requests/get-updates";

export class UpdatesPuller {
    private api: TelegramAPI;

    constructor(api: TelegramAPI) {
        this.api = api;
    }

    public getUpdates(callback: (TelegramMessage) => boolean) {
        let request: GetUpdatesRequest = {
            timeout: 30
        };

        const runBlocking = async () => {
            while (true) {
                try {
                    let response = await this.api.getUpdates(request);
                    console.log("response: " + JSON.stringify(response));
                    if (response.ok) {                        
                        for (const update of response.result) {
                            request.offset = update.update_id + 1;
                            if (update.message) {
                                const shouldStop = callback(update.message);
                                if (shouldStop) {
                                    return;
                                }
                            }    
                        }                        
                    }
                } catch (error) {
                    console.log("failed to get updates: " + error);
                }
            }
        }

        runBlocking();
    }
}