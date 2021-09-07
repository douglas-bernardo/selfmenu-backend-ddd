import MenuItem from '@modules/menu/infra/typeorm/entities/MenuItem';
import OrderItem from '@modules/order/infra/typeorm/entities/OrderItem';
import User from '@modules/users/infra/typeorm/entities/User';
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
import ItemPhoto from './ItemPhoto';

@Entity('item')
class Item {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column()
    available: boolean;

    @ManyToOne(() => User, user => user)
    @JoinColumn({ name: 'owner_id' })
    user: User;

    @Column()
    owner_id: string;

    @Column()
    category_id: number;

    @OneToMany(() => MenuItem, menu_items => menu_items.item)
    menu_item: MenuItem[];

    @OneToMany(() => ItemPhoto, image => image.item, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn({ name: 'item_id' })
    images: ItemPhoto[];

    @OneToMany(() => OrderItem, order_items => order_items.item)
    order_items: OrderItem[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Item;
