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
import { Exclude, Expose } from 'class-transformer';
import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';

@Entity('waiter')
class Waiter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cpf: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    owner_id: string;

    @ManyToOne(() => Establishment)
    @JoinColumn({ name: 'establishment_id' })
    establishment: Establishment;

    @Column()
    establishment_id: string;

    @Column()
    active: boolean;

    @Column()
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Expose({ name: 'avatar_url' })
    getAvatarUrl(): string | null {
        if (!this.avatar) {
            return null;
        }

        switch (uploadConfig.driver) {
            case 'disk':
                return `${process.env.APP_API_URL}/files/${this.avatar}`;
            case 's3':
                return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
            default:
                return null;
        }
    }
}

export default Waiter;
