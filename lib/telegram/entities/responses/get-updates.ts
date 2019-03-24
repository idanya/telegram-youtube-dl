export interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
}
export interface TelegramChat {
    id: number;
}
export interface TelegramMessage {
    message_id: number;
    chat: TelegramChat;
    from: TelegramUser;
    date: number;
    text: string;
}
export interface GetUpdatesResponse {
    update_id: number;
    message: TelegramMessage;
    edited_message: TelegramMessage;
    channel_post: TelegramMessage;
    edited_channel_post: TelegramMessage;
}