import User from '@modules/users/infra/typeorm/entities/User';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plan')
class Plan {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => User, user => user.plan)
    user: User;
}

export default Plan;
