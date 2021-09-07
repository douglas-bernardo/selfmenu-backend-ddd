import Item from '@modules/item/infra/typeorm/entities/Item';
import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
} from 'typeorm';
import Order from './Order';

@Entity('order_item')
class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, order => order.order_items)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Item, product => product.order_items)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column()
    item_id: string;

    @Column()
    order_id: string;

    @Column('decimal')
    price: number;

    @Column('float')
    discount: number;

    @Column('int')
    quantity: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default OrderItem;
