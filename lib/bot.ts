import * as path from 'path';

import { TelegramAPI } from "telegram/api";
import { UpdatesPuller } from "bot/updates-puller";
import { BotCommands } from "domain/bot-commands";
import { startHandler } from "commands/static";
import { MessageProcessor } from "bot/message-processor";
import { YoutubeCommandHandler } from "commands/youtube";
import { YoutubeDownloader } from 'adapters/youtube';

const API_TOKEN = process.env.TELEGRAM_TOKEN;

const telegramApi = new TelegramAPI(API_TOKEN);
const puller = new UpdatesPuller(telegramApi);
const tempDownloadDir = path.join(__dirname, 'downloadTemp');
const youtube = new YoutubeCommandHandler(tempDownloadDir, new YoutubeDownloader());

const commands = new BotCommands();
commands.addCommand('/start', { handler: startHandler, helpText: 'shows welcome message' });
commands.addCommand('/help', { handler: commands.UserHelper, helpText: 'shows help' });
commands.addCommand('/audio', { handler: youtube.AudioDownload, helpText: 'download audio file' });

const processor = new MessageProcessor(telegramApi, commands);

puller.getUpdates(update => {
    processor.Process(update);
    return false;
});
