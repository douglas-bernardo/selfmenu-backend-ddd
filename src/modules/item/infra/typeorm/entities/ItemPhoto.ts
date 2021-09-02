import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Item from './Item';

@Entity('item_photo')
class ItemPhoto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    item_id: string;

    @Column()
    url: string;

    @ManyToOne(() => Item, item => item.images)
    @JoinColumn({ name: 'item_id' })
    item: Item;
}

export default ItemPhoto;
