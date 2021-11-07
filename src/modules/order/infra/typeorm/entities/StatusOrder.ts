import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('status_order')
class StatusOrder {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    name: string;
}

export default StatusOrder;
