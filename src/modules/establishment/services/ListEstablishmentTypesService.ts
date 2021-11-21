import { injectable, inject } from 'tsyringe';

import EstablishmentType from '../infra/typeorm/entities/EstablishmentType';
import IEstablishmentTypeRepository from '../repositories/IEstablishmentTypeRepository';

@injectable()
class ListEstablishmentTypesService {
    constructor(
        @inject('EstablishmentTypeRepository')
        private establishmentTypeRepository: IEstablishmentTypeRepository,
    ) {}

    public async execute(): Promise<EstablishmentType[]> {
        return this.establishmentTypeRepository.findAll();
    }
}

export default ListEstablishmentTypesService;
