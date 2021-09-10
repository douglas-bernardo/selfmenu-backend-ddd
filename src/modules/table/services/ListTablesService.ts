import { injectable, inject } from 'tsyringe';
import Table from '../infra/typeorm/entities/Table';
import ITableRepository from '../repositories/ITableRepository';

interface IRequest {
    restaurant_id?: string;
}

@injectable()
class ListTablesServices {
    constructor(
        @inject('TableRepository') private tableRepository: ITableRepository,
    ) {}

    public async execute({ restaurant_id }: IRequest): Promise<Table[]> {
        return this.tableRepository.findAll({ restaurant_id });
    }
}

export default ListTablesServices;
