import { Stream } from "stream";

export type ParseMode = '' | 'Markdown' | 'HTML';

export interface SendMessageRequest {
    chat_id: number | string;
    text?: string;
    parse_mode?: ParseMode;
    reply_to_message_id?: number;
}

export interface UploadImageRequest {
    chat_id: number | string;
    photo: Stream;
    caption?: string;
    parse_mode?: ParseMode;
}

export interface UploadAudioRequest {
    chat_id: number | string;
    audio: Stream;
    filename: string;
    caption: string;
    parse_mode?: ParseMode;
}
