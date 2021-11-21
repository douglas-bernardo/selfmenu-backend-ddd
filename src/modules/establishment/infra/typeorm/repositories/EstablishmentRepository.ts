import { getRepository, Repository } from 'typeorm';

import ICreateEstablishmentDTO from '@modules/establishment/dtos/ICreateEstablishmentDTO';
import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import IEstablishmentRepository from '@modules/establishment/repositories/IEstablishmentRepository';
import IFindAllEstablishmentsDTO from '@modules/establishment/dtos/IFindAllEstablishmentDTO';
import IFindByIdEstablishmentDTO from '@modules/establishment/dtos/IFindByIdEstablishmentDTO';
import IFindByCNPJEstablishmentDTO from '@modules/establishment/dtos/IFindByCNPJEstablishmentDTO';

class EstablishmentRepository implements IEstablishmentRepository {
    private ormRepository: Repository<Establishment>;

    constructor() {
        this.ormRepository = getRepository(Establishment);
    }

    public async findByCNPJ({
        cnpj,
    }: IFindByCNPJEstablishmentDTO): Promise<Establishment | undefined> {
        const findEstablishment = await this.ormRepository.findOne({
            where: {
                cnpj,
            },
        });

        return findEstablishment;
    }

    public async findById({
        establishment_id,
        owner_id,
    }: IFindByIdEstablishmentDTO): Promise<Establishment | undefined> {
        let establishment: Establishment | undefined;

        if (owner_id) {
            establishment = await this.ormRepository.findOne({
                where: {
                    id: establishment_id,
                    owner_id,
                },
                relations: ['owner'],
            });
        } else {
            establishment = await this.ormRepository.findOne(establishment_id);
        }
        return establishment;
    }

    public async findAll({
        owner_id,
    }: IFindAllEstablishmentsDTO): Promise<Establishment[]> {
        let establishments: Establishment[];

        if (owner_id) {
            establishments = await this.ormRepository.find({
                where: {
                    owner_id,
                },
                relations: ['establishment_type'],
            });
        } else {
            establishments = await this.ormRepository.find({
                relations: ['establishment_type'],
            });
        }

        return establishments;
    }

    public async create(data: ICreateEstablishmentDTO): Promise<Establishment> {
        const establishment = this.ormRepository.create(data);

        await this.ormRepository.save(establishment);

        return establishment;
    }

    public async save(establishment: Establishment): Promise<Establishment> {
        return this.ormRepository.save(establishment);
    }
}

export default EstablishmentRepository;
