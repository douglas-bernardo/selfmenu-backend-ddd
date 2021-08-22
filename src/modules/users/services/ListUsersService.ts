import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class ListUsersService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
    ) {}

    public async execute(): Promise<User[]> {
        return this.usersRepository.findAll();
    }
}

export default ListUsersService;
