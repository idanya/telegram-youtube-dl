import { Readable } from "stream";

export interface RemoteDownloader{
    downloadAudioFile(url: string): Promise<AudioMetadata>;
}

export class AudioMetadata {
    public readableStream: Readable;
    public filename: string;

    constructor(readableStream: Readable, filename: string) {
        this.readableStream = readableStream;
        this.filename = filename;
    }
}