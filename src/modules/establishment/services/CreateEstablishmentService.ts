import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import slugify from '@shared/utils/Helpers';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import IEstablishmentRepository from '../repositories/IEstablishmentRepository';
import Establishment from '../infra/typeorm/entities/Establishment';

interface IRequest {
    name: string;
    cnpj: number;
    description: string;
    establishment_type_id: number;
    account_id: string;
}

@injectable()
class CreateEstablishmentService {
    constructor(
        @inject('EstablishmentRepository')
        private establishmentRepository: IEstablishmentRepository,

        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,
    ) {}

    public async execute({
        name,
        cnpj,
        description,
        establishment_type_id,
        account_id,
    }: IRequest): Promise<Establishment> {
        const account = await this.accountsRepository.findById(account_id);

        if (!account) {
            throw new AppError('Account not found');
        }

        if (!account.active) {
            throw new AppError('Inactive Account. Not allowed.');
        }

        if (account.plan.name === 'Free') {
            const hasEstablishmentCreated =
                await this.establishmentRepository.findAll({
                    owner_id: account.id,
                });

            if (hasEstablishmentCreated.length > 0) {
                throw new AppError(
                    'Only Premium accounts can register more than one establishment by account.',
                );
            }
        }

        const establishmentExists =
            await this.establishmentRepository.findByCNPJ({
                cnpj,
            });

        if (establishmentExists) {
            throw new AppError(
                'There is already a establishment registered with this cnpj',
            );
        }

        const establishment = await this.establishmentRepository.create({
            name,
            cnpj,
            description,
            establishment_type_id,
            owner_id: account.id,
            subdomain: slugify(name),
        });

        return establishment;
    }
}

export default CreateEstablishmentService;
