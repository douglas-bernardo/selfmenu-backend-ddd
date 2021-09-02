import IStorageProvider from '../models/IStorageProvider';

interface IImage {
    url: string;
}

class FakeStorageProvider implements IStorageProvider {
    private storage: string[] = [];

    public async saveFile(file: string): Promise<string> {
        this.storage.push(file);
        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        const findIndex = this.storage.findIndex(
            storageFile => storageFile === file,
        );
        this.storage.splice(findIndex, 1);
    }

    public async saveFiles(files: IImage[]): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async deleteFiles(files: IImage[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export default FakeStorageProvider;
