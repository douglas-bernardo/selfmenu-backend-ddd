import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('waiter')
class Waiter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cpf: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    owner_id: string;

    @Column()
    restaurant_id: string;

    @Column()
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Waiter;
