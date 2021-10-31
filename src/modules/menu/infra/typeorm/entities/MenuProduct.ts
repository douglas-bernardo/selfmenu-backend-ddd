import Product from '@modules/product/infra/typeorm/entities/Product';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Menu from './Menu';

@Entity('menu_product')
class MenuProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Menu, menu => menu.menu_products)
    @JoinColumn({ name: 'menu_id' })
    menu: Menu;

    @ManyToOne(() => Product, product => product.menu_products, { eager: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    menu_id: string;

    @Column()
    product_id: string;

    @Column()
    active: boolean;
}

export default MenuProduct;
