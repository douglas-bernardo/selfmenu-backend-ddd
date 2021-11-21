import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('establishment_type')
class EstablishmentType {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    name: string;
}

export default EstablishmentType;
