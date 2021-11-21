import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import slugify from '@shared/utils/Helpers';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import IEstablishmentRepository from '../repositories/IEstablishmentRepository';
import Establishment from '../infra/typeorm/entities/Establishment';

interface IRequest {
    owner_id: string;
    establishment_id: string;
    name: string;
    cnpj: number;
    description?: string;
    active?: boolean;
    establishment_type_id: number;
}

@injectable()
class UpdateEstablishmentService {
    constructor(
        @inject('EstablishmentRepository')
        private establishmentRepository: IEstablishmentRepository,

        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,
    ) {}

    public async execute({
        owner_id,
        establishment_id,
        name,
        cnpj,
        description,
        active,
        establishment_type_id,
    }: IRequest): Promise<Establishment> {
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Conta não encontrada');
        }

        if (!account.active) {
            throw new AppError('Conta inativa. Não permitifo.');
        }

        const establishmentToEdit = await this.establishmentRepository.findById(
            {
                establishment_id,
            },
        );

        if (!establishmentToEdit) {
            throw new AppError('Estabelecimento não encontrada.');
        }

        const establishmentExists =
            await this.establishmentRepository.findByCNPJ({
                cnpj,
            });

        if (
            establishmentExists &&
            establishmentExists.id !== establishmentToEdit.id
        ) {
            throw new AppError('Já existe um estabelecimento com esse CNPJ');
        }

        const establishmentEdited = Object.assign(establishmentToEdit, {
            name,
            cnpj,
            description,
            establishment_type_id,
            subdomain: slugify(name),
            active,
        });

        return this.establishmentRepository.save(establishmentEdited);
    }
}

export default UpdateEstablishmentService;
