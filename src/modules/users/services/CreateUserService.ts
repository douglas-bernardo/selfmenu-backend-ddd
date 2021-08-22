import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({
        email,
        first_name,
        last_name,
        password,
    }: IRequest): Promise<User> {
        const userExists = await this.usersRepository.findByEmail(email);

        if (userExists) {
            throw new AppError('Email already exists');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            email,
            first_name,
            last_name,
            password: hashedPassword,
        });

        return user;
    }
}

export default CreateUserService;
