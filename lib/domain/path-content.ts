export class PathContent {
    public BasePath: string;
    public Directories: string[];
    public Files: string[];

    constructor(basePath: string, directories: string[], files: string[]){
        this.BasePath = basePath;
        this.Directories = directories;
        this.Files = files;
    }
}