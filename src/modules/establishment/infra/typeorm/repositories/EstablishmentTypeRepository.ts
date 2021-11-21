import { getRepository, Repository } from 'typeorm';

import IEstablishmentTypeRepository from '@modules/establishment/repositories/IEstablishmentTypeRepository';
import EstablishmentType from '../entities/EstablishmentType';

class EstablishmentTypeRepository implements IEstablishmentTypeRepository {
    private ormRepository: Repository<EstablishmentType>;

    constructor() {
        this.ormRepository = getRepository(EstablishmentType);
    }

    public async findAll(): Promise<EstablishmentType[]> {
        return this.ormRepository.find();
    }
}

export default EstablishmentTypeRepository;
