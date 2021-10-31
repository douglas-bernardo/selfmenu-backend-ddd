import { injectable, inject } from 'tsyringe';
import Establishment from '../infra/typeorm/entities/Establishment';
import IEstablishmentRepository from '../repositories/IEstablishmentRepository';

interface IRequest {
    owner_id?: string;
}

@injectable()
class ListEstablishmentsService {
    constructor(
        @inject('EstablishmentRepository')
        private establishmentRepository: IEstablishmentRepository,
    ) {}

    public async execute({ owner_id }: IRequest): Promise<Establishment[]> {
        return this.establishmentRepository.findAll({ owner_id });
    }
}

export default ListEstablishmentsService;
