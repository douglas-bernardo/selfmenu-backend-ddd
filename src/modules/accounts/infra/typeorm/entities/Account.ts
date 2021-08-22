import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import Plan from '@modules/plans/infra/typeorm/entities/Plan';

@Entity('account')
class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.accounts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @ManyToOne(() => Plan, plan => plan.account)
    @JoinColumn({ name: 'plan_id' })
    plan: Plan;

    @Column()
    plan_id: number;

    @Column()
    start_time: Date;

    @Column()
    end_time: Date;

    @Column()
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Account;
