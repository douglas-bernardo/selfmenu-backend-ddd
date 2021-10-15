import User from '@modules/users/infra/typeorm/entities/User';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';
import { Expose } from 'class-transformer';

@Entity('category')
class Category {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    image_cover: string;

    @ManyToOne(() => User, user => user)
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @Column()
    owner_id: string;

    @Column()
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Expose({ name: 'image_cover_url' })
    getImageCoverUrl(): string | null {
        if (!this.image_cover) {
            return null;
        }

        switch (uploadConfig.driver) {
            case 'disk':
                return `${process.env.APP_API_URL}/files/${this.image_cover}`;
            case 's3':
                return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.image_cover}`;
            default:
                return null;
        }
    }
}

export default Category;
