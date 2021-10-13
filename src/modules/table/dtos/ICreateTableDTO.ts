import Restaurant from '@modules/restaurant/infra/typeorm/entities/Restaurant';
import User from '@modules/users/infra/typeorm/entities/User';
import Waiter from '@modules/waiter/infra/typeorm/entities/Waiter';

export default interface ICreateTableDTO {
    number: number;
    capacity: number;
    restaurant: Restaurant;
    waiter: Waiter;
    owner: User;
}
