import Account from '@modules/account/infra/typeorm/entities/Account';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plan')
class Plan {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Account, account => account.plan)
    account: Account;
}

export default Plan;
