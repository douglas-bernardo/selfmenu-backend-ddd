import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import Plan from './Plan';

@Entity('user')
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    profile_name: string;

    @Column()
    active: boolean;

    @ManyToOne(() => Plan, plan => plan.user)
    @JoinColumn({ name: 'plan_id' })
    plan: Plan;

    @Column()
    plan_id: number;

    @Column()
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default User;
