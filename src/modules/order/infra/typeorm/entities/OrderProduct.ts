import Product from '@modules/product/infra/typeorm/entities/Product';
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

@Entity('order_product')
class OrderProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, order => order.order_products)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product, product => product.order_products, {
        eager: true,
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    product_id: string;

    @Column()
    order_id: string;

    @Column()
    details: string;

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

export default OrderProduct;
