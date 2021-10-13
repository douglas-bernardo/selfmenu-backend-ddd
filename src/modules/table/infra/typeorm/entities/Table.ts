import Order from '@modules/order/infra/typeorm/entities/Order';
import Restaurant from '@modules/restaurant/infra/typeorm/entities/Restaurant';
import User from '@modules/users/infra/typeorm/entities/User';
import Waiter from '@modules/waiter/infra/typeorm/entities/Waiter';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Expose } from 'class-transformer';

@Entity('table')
class Table {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    token: string;

    @Column()
    number: number;

    @Column()
    capacity: number;

    @ManyToOne(() => Restaurant)
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;

    @Column()
    restaurant_id: string;

    @ManyToOne(() => Waiter)
    @JoinColumn({ name: 'waiter_id' })
    waiter: Waiter;

    @Column()
    waiter_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @Column()
    owner_id: string;

    @OneToMany(() => Order, order => order.table)
    @JoinColumn([
        { name: 'table_id', referencedColumnName: 'id' },
        { name: 'token', referencedColumnName: 'token' },
    ])
    orders: Order[];

    @Column()
    available: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Expose({ name: 'url_authenticate' })
    getUrlAuthenticate(): string {
        return `${process.env.APP_API_URL}/app/tables/${this.id}`;
    }
}

export default Table;
