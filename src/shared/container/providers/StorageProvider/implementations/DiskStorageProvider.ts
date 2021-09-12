import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

interface IImage {
    url: string;
}

class DiskStorageProvider implements IStorageProvider {
    public async saveFile(file: string): Promise<string> {
        await fs.promises.rename(
            path.resolve(uploadConfig.tmpFolder, file),
            path.resolve(uploadConfig.uploadsFolder, file),
        );
        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        const filePath = path.resolve(uploadConfig.uploadsFolder, file);

        try {
            await fs.promises.stat(filePath);
        } catch {
            return;
        }
        await fs.promises.unlink(filePath);
    }

    public async saveFiles(files: IImage[]): Promise<void> {
        await Promise.all(
            files.map(async file => {
                await fs.promises.rename(
                    path.resolve(uploadConfig.tmpFolder, file.url),
                    path.resolve(uploadConfig.uploadsFolder, file.url),
                );
            }),
        );
    }

    public async deleteFiles(files: IImage[]): Promise<void> {
        await Promise.all(
            files.map(async file => {
                const filePath = path.resolve(
                    uploadConfig.uploadsFolder,
                    file.url,
                );
                try {
                    await fs.promises.stat(filePath);
                } catch {
                    return;
                }
                await fs.promises.unlink(filePath);
            }),
        );
    }
}

export default DiskStorageProvider;
