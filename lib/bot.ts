import { TelegramAPI } from "telegram/api";
import { UpdatesPuller } from "bot/updates-puller";
import { BotCommands } from "domain/bot-commands";
import { startHandler } from "commands/static";
import { MessageProcessor } from "bot/message-processor";
import { YoutubeCommandHandler } from "commands/youtube";
import { YoutubeDownloader } from 'adapters/youtube';

if (process.env.TELEGRAM_TOKEN == undefined || process.env.TELEGRAM_TOKEN == "") {
    console.log("Environment variable TELEGRAM_TOKEN is mandatory.");
    process.exit(1);
}

function processUpdates(update) {
    processor.Process(update);
    return false;
};

const telegramApi = new TelegramAPI(process.env.TELEGRAM_TOKEN);
const youtube = new YoutubeCommandHandler(new YoutubeDownloader());

const commands = new BotCommands();
commands.addCommand('/start', { handler: startHandler, helpText: 'shows welcome message' });
commands.addCommand('/help', { handler: commands.UserHelper, helpText: 'shows help' });
commands.addCommand('/audio', { handler: youtube.AudioDownload, helpText: 'download audio file' });

const processor = new MessageProcessor(telegramApi, commands);
const puller = new UpdatesPuller(telegramApi, processUpdates);

puller.getUpdates();
