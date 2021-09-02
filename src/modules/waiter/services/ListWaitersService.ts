import { injectable, inject } from 'tsyringe';

import IWaiterRepository from '../repositories/IWaiterRepository';
import Waiter from '../infra/typeorm/entities/Waiter';

interface IRequest {
    owner_id: string;
}

@injectable()
class ListWaitersService {
    constructor(
        @inject('WaiterRepository') private waiterRepository: IWaiterRepository,
    ) {}

    public async execute({ owner_id }: IRequest): Promise<Waiter[]> {
        return this.waiterRepository.findAll({
            owner_id,
        });
    }
}

export default ListWaitersService;
