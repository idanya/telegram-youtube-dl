import axios, { AxiosResponse, AxiosError } from 'axios';
import { TelegramResponse } from 'telegram/entities/responses/response';
import { GetMeResponse } from 'telegram/entities/responses/getme';
import { GetUpdatesResponse, TelegramMessage } from 'telegram/entities/responses/get-updates';
import { GetUpdatesRequest } from 'telegram/entities/requests/get-updates';
import { SendMessageRequest } from 'telegram/entities/requests/send-messages';
import { UploadAudioRequest } from 'telegram/entities/requests/send-messages';
import * as FormData from "form-data";

const API_HOST = 'https://api.telegram.org';

export class TelegramAPI {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private createMethodUrl(method: string): string {
        return `${API_HOST}/bot${this.token}/${method}`;
    }

    private doGet<T>(method: string): Promise<TelegramResponse<T>> {
        console.log(`doGet - ${method}`);

        return new Promise<TelegramResponse<T>>((resolve, reject) => {
            axios.get(this.createMethodUrl(method))
                .then((response: AxiosResponse) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    console.log(error.message);
                    reject(error.message);
                });
        })
    }

    private doPost<R, T>(method: string, data: R): Promise<TelegramResponse<T>> {
        const url = this.createMethodUrl(method);
        console.log(`doPost - ${url}`)
        const headers = {
            'Content-Type': 'application/json',
        }

        return new Promise<TelegramResponse<T>>((resolve, reject) => {
            axios.post(url, data, { headers: headers })
                .then((response: AxiosResponse) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    console.log(error.message);
                    reject(error.message);
                });
        });
    }

    private doFormDataPost<T>(method: string, data: FormData): Promise<TelegramResponse<T>> {
        console.log(`doFormDataPost - ${method}`)

        return new Promise<TelegramResponse<T>>((resolve, reject) => {
            axios.post(this.createMethodUrl(method), data, { headers: data.getHeaders() })
                .then((response: AxiosResponse) => {
                    resolve(response.data);
                })
                .catch((error: AxiosError) => {
                    console.log(error.message);
                    reject(null);
                });
        });
    }


    public async getMe(): Promise<TelegramResponse<GetMeResponse>> {
        return await this.doGet<GetMeResponse>('getMe');
    }

    public async getUpdates(request: GetUpdatesRequest): Promise<TelegramResponse<GetUpdatesResponse[]>> {
        return await this.doPost<GetUpdatesRequest, GetUpdatesResponse[]>('getUpdates', request);
    }

    public async sendMessage(request: SendMessageRequest): Promise<TelegramResponse<TelegramMessage>> {
        return await this.doPost<SendMessageRequest, TelegramMessage>('sendMessage', request);
    }
Î
    public async sendAudio(request: UploadAudioRequest): Promise<TelegramResponse<TelegramMessage>> {
        let form = new FormData();
        form.append('chat_id', request.chat_id);
        form.append('caption', request.caption);
        form.append('audio', request.audio);
        form.append('parse_mode', request.parse_mode);

        return await this.doFormDataPost<TelegramMessage>('sendAudio', form);
    }

}