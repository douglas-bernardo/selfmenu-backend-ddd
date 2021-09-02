import { v4 as uuid } from 'uuid';

import Waiter from '@modules/waiter/infra/typeorm/entities/Waiter';
import ICreateWaiterDTO from '@modules/waiter/dtos/ICreateWaiterDTO';
import IFindAllWaiterDTO from '@modules/waiter/dtos/IFindAllWaiterDTO';
import IFindByIdWaiterDTO from '@modules/waiter/dtos/IFindByIdWaiterDTO';
import IFindByCPFWaiterDTO from '@modules/waiter/dtos/IFindByCPFWaiterDTO';
import IWaiterRepository from '../IWaiterRepository';

class FakeWaiterRepository implements IWaiterRepository {
    private waiters: Waiter[] = [];

    public async findAll({ owner_id }: IFindAllWaiterDTO): Promise<Waiter[]> {
        let { waiters } = this;

        if (owner_id) {
            waiters = this.waiters.filter(
                waiter => waiter.owner_id === owner_id,
            );
        }

        return waiters;
    }

    public async findById({
        waiter_id,
        owner_id,
    }: IFindByIdWaiterDTO): Promise<Waiter | undefined> {
        let findWaiter: Waiter | undefined;

        if (owner_id) {
            findWaiter = this.waiters.find(
                waiter =>
                    waiter.id === waiter_id && waiter.owner_id === owner_id,
            );
        } else {
            findWaiter = this.waiters.find(waiter => waiter.id === waiter_id);
        }

        return findWaiter;
    }

    public async findByCPF({
        cpf,
        owner_id,
    }: IFindByCPFWaiterDTO): Promise<Waiter | undefined> {
        let findWaiter: Waiter | undefined;

        if (owner_id) {
            findWaiter = this.waiters.find(
                waiter => waiter.cpf === cpf && waiter.owner_id === owner_id,
            );
        } else {
            findWaiter = this.waiters.find(waiter => waiter.cpf === cpf);
        }

        return findWaiter;
    }

    public async create(data: ICreateWaiterDTO): Promise<Waiter> {
        const waiter = new Waiter();

        Object.assign(waiter, { id: uuid(), active: true }, data);

        this.waiters.push(waiter);
        return waiter;
    }

    public async save(waiter: Waiter): Promise<Waiter> {
        const findIndex = this.waiters.findIndex(
            findWaiter => findWaiter.id === waiter.id,
        );

        this.waiters[findIndex] = waiter;
        return waiter;
    }
}

export default FakeWaiterRepository;
