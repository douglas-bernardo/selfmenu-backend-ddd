import Account from '@modules/account/infra/typeorm/entities/Account';

export default interface ICreateCategoryDTO {
    name: string;
    owner: Account;
    image_cover?: string;
}
