import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import Account from '@modules/account/infra/typeorm/entities/Account';
import EstablishmentType from './EstablishmentType';

@Entity('establishment')
class Establishment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    subdomain: string;

    @Column()
    cnpj: number;

    @Column()
    owner_id: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'owner_id' })
    owner: Account;

    @Column()
    active: boolean;

    @Column()
    description: string;

    @ManyToOne(() => EstablishmentType)
    @JoinColumn({ name: 'establishment_type_id' })
    establishment_type: EstablishmentType;

    @Column()
    establishment_type_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Establishment;
