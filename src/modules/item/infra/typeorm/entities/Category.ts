import User from '@modules/users/infra/typeorm/entities/User';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('category')
class Category {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => User, user => user)
    @JoinColumn({ name: 'owner_id' })
    user: User;

    @Column()
    owner_id: string;
}

export default Category;
