import * as ytdl from 'ytdl-core';
import * as fs from "fs";

describe.skip("youtube-dl tests", () => {
    it("should download mp3", async (done) => {        
        const info = await ytdl.getInfo('http://www.youtube.com/watch?v=A02s8omM_hI');
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        
        ytdl('http://www.youtube.com/watch?v=A02s8omM_hI', { format: audioFormats[0] })
            .on("progress", (chuck_size, total_downloaded, total_exists) => {
                console.log(`total_downloaded: ${total_downloaded} - total_exists: ${total_exists}`);
                if (total_downloaded == total_exists) {
                    expect(total_downloaded).toBe(84534);
                    done();
                }
            })
            .pipe(fs.createWriteStream('/dev/null'));;
    });
});