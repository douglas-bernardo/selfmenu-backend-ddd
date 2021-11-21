import { injectable, inject } from 'tsyringe';

import IWaiterRepository from '../repositories/IWaiterRepository';
import Waiter from '../infra/typeorm/entities/Waiter';

interface IRequest {
    owner_id: string;
    offset?: number;
    limit?: number;
}

interface IResponse {
    waiters: Waiter[];
    total: number;
}

@injectable()
class ListWaitersService {
    constructor(
        @inject('WaiterRepository') private waiterRepository: IWaiterRepository,
    ) {}

    public async execute({
        owner_id,
        offset,
        limit,
    }: IRequest): Promise<IResponse> {
        const count = await this.waiterRepository.count({
            owner_id,
        });

        const waiters = await this.waiterRepository.findAll({
            owner_id,
            offset,
            limit,
        });

        return { waiters, total: count };
    }
}

export default ListWaitersService;
