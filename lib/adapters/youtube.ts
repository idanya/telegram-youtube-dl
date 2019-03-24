import * as ytdl from 'ytdl-core';
import * as fs from "fs";
import * as path from "path";
import { v4 } from 'uuid';
import { RemoteDownloader } from './downloader';

export class YoutubeDownloader implements RemoteDownloader {

    public async downloadAudioFile(youtubeUrl: string, outputPath: string): Promise<string> {        
        const info = await ytdl.getInfo(youtubeUrl);
        console.log("got info: " + info);
        if (!info) {
            throw Error("failed to get video info");
        }

        
        console.log("creating: " + outputPath);
        fs.mkdirSync(outputPath, { recursive: true });

        const audioFormat = this.selectFormat(info);        

        const savePath = path.join(outputPath, `${v4()}.${audioFormat.container}`);
        return await this.downloadFormat(youtubeUrl, audioFormat, savePath);
    }

    private selectFormat(info: ytdl.videoInfo): ytdl.videoFormat {
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        if (!audioFormats || audioFormats.length == 0) {
            throw new Error("failed to get audio format of the video");
        }
        return audioFormats[0];
    }

    private async downloadFormat(youtubeUrl: string, format: ytdl.videoFormat, outputPath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const savePath = path.join(outputPath, `${v4()}.${format.container}`);

            ytdl(youtubeUrl, { format: format })
                .on("progress", (chuck_size, total_downloaded, total_exists) => {
                    console.log(`total_downloaded: ${total_downloaded} - total_exists: ${total_exists}`);
                    if (total_downloaded == total_exists) {
                        resolve(savePath);
                    }
                })
                .pipe(fs.createWriteStream(savePath));
        });
    }
}