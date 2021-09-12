import Restaurant from '@modules/restaurant/infra/typeorm/entities/Restaurant';
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
import OrderItem from './OrderItem';

@Entity('order')
class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    token: string;

    @Column()
    status_order_id: number;

    @ManyToOne(() => Restaurant)
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;

    @Column()
    restaurant_id: string;

    @ManyToOne(() => Waiter)
    @JoinColumn({ name: 'waiter_id' })
    waiter: Waiter;

    @ManyToOne(() => Table)
    @JoinColumn([
        { name: 'table_id', referencedColumnName: 'id' },
        { name: 'token', referencedColumnName: 'token' },
    ])
    table: Table;

    @OneToMany(() => OrderItem, order_items => order_items.order, {
        cascade: true,
    })
    order_items: OrderItem[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Order;
