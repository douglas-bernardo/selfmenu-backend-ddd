import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import Account from '@modules/account/infra/typeorm/entities/Account';

interface IProduct {
    product_id: string;
}

export default interface ICreateMenuDTO {
    title: string;
    description?: string;
    owner: Account;
    establishment: Establishment;
    products?: IProduct[];
}
