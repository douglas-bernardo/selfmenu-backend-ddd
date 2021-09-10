import Item from '@modules/item/infra/typeorm/entities/Item';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Menu from './Menu';

@Entity('menu_item')
class MenuItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Menu, menu => menu.menu_items)
    @JoinColumn({ name: 'menu_id' })
    menu: Menu;

    @ManyToOne(() => Item, item => item.menu_items)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column()
    menu_id: string;

    @Column()
    item_id: string;

    @Column()
    active: boolean;
}

export default MenuItem;
