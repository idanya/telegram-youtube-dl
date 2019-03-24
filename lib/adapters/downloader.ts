export interface RemoteDownloader{
    downloadAudioFile(url: string, outputPath: string): Promise<string>;
}