import Account from '@modules/account/infra/typeorm/entities/Account';
import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
// import Table from '@modules/table/infra/typeorm/entities/Table';
import Waiter from '@modules/waiter/infra/typeorm/entities/Waiter';

interface IProduct {
    product_id: string;
    price: number;
    quantity: number;
    discount?: number;
}

export default interface ICreateOrderDTO {
    table_token: string;
    customer_name: string;
    status_order_id: number;
    establishment: Establishment;
    waiter: Waiter;
    table_id: string;
    owner: Account;
    products: IProduct[];
}
