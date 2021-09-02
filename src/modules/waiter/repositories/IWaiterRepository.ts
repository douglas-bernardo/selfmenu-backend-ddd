import ICreateWaiterDTO from '../dtos/ICreateWaiterDTO';
import IFindAllWaiterDTO from '../dtos/IFindAllWaiterDTO';
import IFindByCPFWaiterDTO from '../dtos/IFindByCPFWaiterDTO';
import IFindByIdWaiterDTO from '../dtos/IFindByIdWaiterDTO';
import Waiter from '../infra/typeorm/entities/Waiter';

export default interface IWaiterRepository {
    findAll(data?: IFindAllWaiterDTO): Promise<Waiter[]>;
    findById(data: IFindByIdWaiterDTO): Promise<Waiter | undefined>;
    findByCPF(data: IFindByCPFWaiterDTO): Promise<Waiter | undefined>;
    create(data: ICreateWaiterDTO): Promise<Waiter>;
    save(waiter: Waiter): Promise<Waiter>;
}
