import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime-types';

import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class SESMailProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new aws.S3({
            region: 'us-east-1',
        });
    }

    public async saveFile(file: string): Promise<string> {
        const originalPath = await path.resolve(uploadConfig.tmpFolder, file);

        const ContentType = mime.lookup(originalPath);
        console.log(ContentType);

        if (!ContentType) {
            throw new Error('File not found');
        }

        const fileContent = await fs.promises.readFile(originalPath);

        await this.client
            .putObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file,
                ACL: 'public-read',
                Body: fileContent,
                ContentType,
            })
            .promise();

        await fs.promises.unlink(originalPath);

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file,
            })
            .promise();
    }

    public async saveFiles(files: IImage[]): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async deleteFiles(files: IImage[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export default SESMailProvider;
