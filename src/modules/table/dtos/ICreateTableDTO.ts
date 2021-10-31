import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import Account from '@modules/account/infra/typeorm/entities/Account';
import Waiter from '@modules/waiter/infra/typeorm/entities/Waiter';

export default interface ICreateTableDTO {
    number: number;
    capacity: number;
    establishment: Establishment;
    waiter: Waiter;
    owner: Account;
}
