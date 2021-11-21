import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('status_table')
class StatusTable {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    name: string;
}

export default StatusTable;
