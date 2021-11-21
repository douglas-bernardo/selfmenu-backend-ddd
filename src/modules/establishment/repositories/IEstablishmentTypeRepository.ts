import EstablishmentType from '../infra/typeorm/entities/EstablishmentType';

export default interface IEstablishmentTypeRepository {
    findAll(): Promise<EstablishmentType[]>;
}
