import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IWaiterRepository from '../repositories/IWaiterRepository';
import Waiter from '../infra/typeorm/entities/Waiter';

interface IRequest {
    id: string;
    owner_id?: string;
}

@injectable()
class ShowWaiterService {
    constructor(
        @inject('WaiterRepository') private waiterRepository: IWaiterRepository,
    ) {}

    public async execute({ id, owner_id }: IRequest): Promise<Waiter> {
        const waiter = await this.waiterRepository.findById({
            waiter_id: id,
            owner_id,
        });

        if (!waiter) {
            throw new AppError('Waiter not found');
        }

        return waiter;
    }
}

export default ShowWaiterService;
