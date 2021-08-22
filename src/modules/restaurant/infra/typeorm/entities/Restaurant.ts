import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import Account from '@modules/accounts/infra/typeorm/entities/Account';

@Entity('restaurant')
class Restaurant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    subdomain: string;

    @Column()
    cnpj: string;

    @Column()
    account_id: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column()
    active: boolean;

    @Column()
    description: string;

    @Column()
    restaurant_type_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Restaurant;
