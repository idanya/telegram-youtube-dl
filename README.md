**telegram-youtube-dl** - Telegram bot to download Youtube content.

- [Setting up](#setting-up)
- [Install](#install)
- [Usage](#usage)
  - [Run types](#run-types)
- [Bot commands](#bot-commands)
- [Testing](#testing)
- [Docker](#docker)
## Setting up
Before you can run a Telegram bot, you have to create it and get it's API token. To do that, open Telegram and talk to 
[@Botfather](https://t.me/botfather) (it's a bot of course). 

## Install
`npm install`

## Usage
The app expects `TELEGRAM_TOKEN` environment variable to contain the bot token. make sure you set it up via `export TELEGRAM_TOKEN=<token>` or inline with the `npm run` command.  

### Run types
`npm run dev` - use ts-node. </br>
`npm run start` - use node to run transpiled code from dist folder. use this if everything already transpilied.</br> 
`npm run prod` - tranpile the code and run `start`.

## Bot commands
`/start` - welcome message </br>
`/help` - help message </br>

`/audio <video url>` - This will download the audio format of the video and send it to the requesting user. 

## Testing
`npm run test` - run all tests </br>
`npm run short-test` - skip integration tests

## Docker
After building the Dockerfile, run with your token as ENV variable.

`docker run -d -e TELEGRAM_TOKEN=<your bot token> <image name>`