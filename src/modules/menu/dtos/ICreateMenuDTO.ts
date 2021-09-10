import Restaurant from '@modules/restaurant/infra/typeorm/entities/Restaurant';
import User from '@modules/users/infra/typeorm/entities/User';

interface IItem {
    item_id: string;
}

export default interface ICreateMenuDTO {
    title: string;
    description?: string;
    owner: User;
    restaurant: Restaurant;
    items?: IItem[];
}
