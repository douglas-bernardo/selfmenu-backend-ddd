import User from '@modules/users/infra/typeorm/entities/User';

export default interface ICreateCategoryDTO {
    name: string;
    owner: User;
}
