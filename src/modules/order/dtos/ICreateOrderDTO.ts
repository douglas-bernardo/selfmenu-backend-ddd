import Restaurant from '@modules/restaurant/infra/typeorm/entities/Restaurant';
import Table from '@modules/table/infra/typeorm/entities/Table';
import Waiter from '@modules/waiter/infra/typeorm/entities/Waiter';

interface IItem {
    item_id: string;
    price: number;
    quantity: number;
    discount?: number;
}

export default interface ICreateOrderDTO {
    token: string;
    status_order_id: number;
    restaurant: Restaurant;
    waiter: Waiter;
    table: Table;
    items: IItem[];
}
