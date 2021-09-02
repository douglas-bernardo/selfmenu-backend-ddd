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

    @Column()
    menu_id: string;

    @ManyToOne(() => Menu, menu => menu.menu_item)
    @JoinColumn({ name: 'menu_id' })
    menu: Menu;

    @Column()
    item_id: string;

    @ManyToOne(() => Item, item => item.menu_item)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column()
    active: boolean;
}

export default MenuItem;
