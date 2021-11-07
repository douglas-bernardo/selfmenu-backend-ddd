import Account from '@modules/account/infra/typeorm/entities/Account';
import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import Table from '@modules/table/infra/typeorm/entities/Table';
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
import OrderProduct from './OrderProduct';
import StatusOrder from './StatusOrder';

@Entity('order')
class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    table_token: string;

    @ManyToOne(() => StatusOrder)
    @JoinColumn({ name: 'status_order_id' })
    status_order: StatusOrder;

    @Column()
    status_order_id: number;

    @ManyToOne(() => Establishment)
    @JoinColumn({ name: 'establishment_id' })
    establishment: Establishment;

    @Column()
    establishment_id: string;

    @ManyToOne(() => Waiter)
    @JoinColumn({ name: 'waiter_id' })
    waiter: Waiter;

    @Column()
    owner_id: string;

    @ManyToOne(() => Waiter)
    @JoinColumn({ name: 'owner_id' })
    owner: Account;

    @ManyToOne(() => Table)
    @JoinColumn([
        { name: 'table_id', referencedColumnName: 'id' },
        { name: 'table_token', referencedColumnName: 'token' },
    ])
    table: Table;

    @Column()
    table_id: string;

    @Column()
    customer_name: string;

    @OneToMany(() => OrderProduct, order_products => order_products.order, {
        cascade: true,
    })
    order_products: OrderProduct[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Order;
