import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import IEstablishmentRepository from '../repositories/IEstablishmentRepository';
import Establishment from '../infra/typeorm/entities/Establishment';

interface IRequest {
    id: string;
    owner_id?: string;
}

@injectable()
class ShowEstablishmentService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('EstablishmentRepository')
        private establishmentRepository: IEstablishmentRepository,
    ) {}

    public async execute({ id, owner_id }: IRequest): Promise<Establishment> {
        if (owner_id) {
            const account = await this.accountsRepository.findById(owner_id);

            if (!account) {
                throw new AppError('Account account not found');
            }
        }

        const establishment = await this.establishmentRepository.findById({
            establishment_id: id,
            owner_id,
        });

        if (!establishment) {
            throw new AppError('Establishment not found');
        }

        return establishment;
    }
}

export default ShowEstablishmentService;
