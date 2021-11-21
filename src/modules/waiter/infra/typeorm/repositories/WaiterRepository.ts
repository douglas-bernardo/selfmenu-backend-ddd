import { getRepository, Repository } from 'typeorm';

import Waiter from '@modules/waiter/infra/typeorm/entities/Waiter';
import ICreateWaiterDTO from '@modules/waiter/dtos/ICreateWaiterDTO';
import IWaiterRepository from '@modules/waiter/repositories/IWaiterRepository';
import IFindAllWaiterDTO from '@modules/waiter/dtos/IFindAllWaiterDTO';
import IFindByIdWaiterDTO from '@modules/waiter/dtos/IFindByIdWaiterDTO';
import IFindByCPFWaiterDTO from '@modules/waiter/dtos/IFindByCPFWaiterDTO';

interface ICountRecords {
    [key: string]: any;
}

class WaiterRepository implements IWaiterRepository {
    private ormRepository: Repository<Waiter>;

    constructor() {
        this.ormRepository = getRepository(Waiter);
    }

    public async count(data: ICountRecords): Promise<number> {
        return this.ormRepository.count({
            where: data,
        });
    }

    public async findAll({
        owner_id,
        offset,
        limit,
    }: IFindAllWaiterDTO): Promise<Waiter[]> {
        let waiters: Waiter[];

        if (owner_id) {
            waiters = await this.ormRepository.find({
                where: {
                    owner_id,
                },
                skip: offset || 0, // offset
                take: limit || 10, // limit
                relations: ['establishment'],
            });
        } else {
            waiters = await this.ormRepository.find();
        }

        return waiters;
    }

    public async findById({
        waiter_id,
        owner_id,
    }: IFindByIdWaiterDTO): Promise<Waiter | undefined> {
        let waiter: Waiter | undefined;

        if (owner_id) {
            waiter = await this.ormRepository.findOne({
                where: {
                    id: waiter_id,
                    owner_id,
                },
                relations: ['establishment'],
            });
        } else {
            waiter = await this.ormRepository.findOne(waiter_id, {
                relations: ['establishment'],
            });
        }
        return waiter;
    }

    public async findByCPF({
        cpf,
        owner_id,
    }: IFindByCPFWaiterDTO): Promise<Waiter | undefined> {
        let waiter: Waiter | undefined;

        if (owner_id) {
            waiter = await this.ormRepository.findOne({
                where: {
                    cpf,
                    owner_id,
                },
            });
        } else {
            waiter = await this.ormRepository.findOne({
                where: {
                    cpf,
                },
            });
        }
        return waiter;
    }

    public async create(data: ICreateWaiterDTO): Promise<Waiter> {
        const waiter = this.ormRepository.create(data);

        await this.ormRepository.save(waiter);

        return waiter;
    }

    public async save(waiter: Waiter): Promise<Waiter> {
        return this.ormRepository.save(waiter);
    }
}

export default WaiterRepository;
