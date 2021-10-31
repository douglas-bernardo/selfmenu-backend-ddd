import MenuProduct from '@modules/menu/infra/typeorm/entities/MenuProduct';
import OrderProduct from '@modules/order/infra/typeorm/entities/OrderProduct';
import Account from '@modules/account/infra/typeorm/entities/Account';
import { Expose } from 'class-transformer';
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
import uploadConfig from '@config/upload';
import Category from './Category';

@Entity('product')
class Product {
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

    @ManyToOne(() => Account, account => account)
    @JoinColumn({ name: 'owner_id' })
    account: Account;

    @Column()
    owner_id: string;

    @ManyToOne(() => Category, category => category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column()
    category_id: number;

    @OneToMany(() => MenuProduct, menu_products => menu_products.product)
    menu_products: MenuProduct[];

    @OneToMany(() => OrderProduct, order_products => order_products.product)
    order_products: OrderProduct[];

    @Column()
    photo: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Expose({ name: 'photo_url' })
    getPhotoUrl(): string | null {
        if (!this.photo) {
            return null;
        }

        switch (uploadConfig.driver) {
            case 'disk':
                return `${process.env.APP_API_URL}/files/${this.photo}`;
            case 's3':
                return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.photo}`;
            default:
                return null;
        }
    }
}

export default Product;
