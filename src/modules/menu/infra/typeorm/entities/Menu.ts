import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import Account from '@modules/account/infra/typeorm/entities/Account';
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
import MenuProduct from './MenuProduct';

@Entity('menu')
class Menu {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    owner_id: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'owner_id' })
    owner: Account;

    @Column()
    establishment_id: string;

    @ManyToOne(() => Establishment)
    @JoinColumn({ name: 'establishment_id' })
    establishment: Establishment;

    @OneToMany(() => MenuProduct, menu_products => menu_products.menu, {
        cascade: true,
    })
    menu_products: MenuProduct[];

    @Column()
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Menu;
