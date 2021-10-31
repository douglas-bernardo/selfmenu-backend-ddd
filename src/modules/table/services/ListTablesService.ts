import { injectable, inject } from 'tsyringe';
import Table from '../infra/typeorm/entities/Table';
import ITableRepository from '../repositories/ITableRepository';

interface IRequest {
    owner_id?: string;
}

@injectable()
class ListTablesServices {
    constructor(
        @inject('TableRepository') private tableRepository: ITableRepository,
    ) {}

    public async execute({ owner_id }: IRequest): Promise<Table[]> {
        return this.tableRepository.findAll({ owner_id });
    }
}

export default ListTablesServices;
