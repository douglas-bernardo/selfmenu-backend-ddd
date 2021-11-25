import Order from '@modules/order/infra/typeorm/entities/Order';
import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import Account from '@modules/account/infra/typeorm/entities/Account';
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
import StatusTable from './StatusTable';

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

    @ManyToOne(() => Establishment)
    @JoinColumn({ name: 'establishment_id' })
    establishment: Establishment;

    @Column()
    establishment_id: string;

    @ManyToOne(() => Waiter)
    @JoinColumn({ name: 'waiter_id' })
    waiter: Waiter;

    @Column()
    waiter_id: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'owner_id' })
    owner: Account;

    @Column()
    owner_id: string;

    @OneToMany(() => Order, order => order.table)
    @JoinColumn([
        { name: 'table_id', referencedColumnName: 'id' },
        { name: 'token', referencedColumnName: 'token' },
    ])
    orders: Order[];

    @Column()
    active: boolean;

    @ManyToOne(() => StatusTable)
    @JoinColumn({ name: 'status_table_id' })
    status_table: StatusTable;

    @Column()
    status_table_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Expose({ name: 'url_authenticate' })
    getUrlAuthenticate(): string {
        return `${process.env.APP_API_URL}/app/sessions/tables/${this.id}`;
    }
}

export default Table;
