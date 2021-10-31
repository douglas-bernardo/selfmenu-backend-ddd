import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('account_token')
class AccountToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    account_id: string;

    @Column()
    @Generated('uuid')
    token: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default AccountToken;
