import Restaurant from '@modules/restaurant/infra/typeorm/entities/Restaurant';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('table')
class Table {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    token: string;

    @Column()
    code: string;

    @Column()
    capacity: number;

    @ManyToOne(() => Restaurant)
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;

    @Column()
    restaurant_id: string;

    @Column()
    waiter_id: string;

    @Column()
    available: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Table;
