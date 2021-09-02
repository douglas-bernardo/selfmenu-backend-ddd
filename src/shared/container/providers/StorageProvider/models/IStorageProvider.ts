interface IImage {
    url: string;
}

export default interface IStorageProvider {
    saveFile(file: string): Promise<string>;
    saveFiles(files: IImage[]): Promise<void>;
    deleteFile(file: string): Promise<void>;
    deleteFiles(files: IImage[]): Promise<void>;
}
