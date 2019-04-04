import { TelegramAPI } from "telegram/api";
import { TelegramMessage, GetUpdatesResponse } from "telegram/entities/responses/get-updates";
import { GetUpdatesRequest } from "telegram/entities/requests/get-updates";
import { TelegramResponse } from "telegram/entities/responses/response";


export type PullerCallback = (TelegramMessage) => boolean;

export class UpdatesPuller {
    private api: TelegramAPI;
    private callback: PullerCallback;
    private updatesRequest: GetUpdatesRequest;


    constructor(api: TelegramAPI, callback: PullerCallback) {
        this.api = api;
        this.callback = callback;
        this.updatesRequest = {
            timeout: 30
        };
    }

    private handleResponse(response: TelegramResponse<GetUpdatesResponse[]>): boolean {
        if (response.ok) {
            for (const update of response.result) {
                this.updatesRequest.offset = update.update_id + 1;
                if (update.message) {
                    const shouldStop = this.callback(update.message);
                    if (shouldStop) return shouldStop;
                }
            }
        }
        
        return false;
    }

    public getUpdates() {
        const runBlocking = async () => {
            while (true) {
                try {
                    let response = await this.api.getUpdates(this.updatesRequest);
                    console.log("response: " + JSON.stringify(response));
                    const shouldStop = this.handleResponse(response);
                    if (shouldStop) {
                        return;
                    }
                } catch (error) {
                    console.log("failed to get updates: " + error);
                }
            }
        }

        runBlocking();
    }
}