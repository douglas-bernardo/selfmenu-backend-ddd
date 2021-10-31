import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Expose } from 'class-transformer';
import uploadConfig from '@config/upload';

// import Item from './Item';

@Entity('item_photo')
class ItemPhoto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    item_id: string;

    @Column()
    url: string;

    // @ManyToOne(() => Item, item => item.images)
    // @JoinColumn({ name: 'item_id' })
    // item: Item;

    @Expose({ name: 'image_url' })
    getImageUrl(): string | null {
        if (!this.url) {
            return null;
        }

        switch (uploadConfig.driver) {
            case 'disk':
                return `${process.env.APP_API_URL}/files/${this.url}`;
            case 's3':
                return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.url}`;
            default:
                return null;
        }
    }
}

export default ItemPhoto;
