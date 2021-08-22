import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserTokenRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';
import IAccountRepository from '@modules/accounts/repositories/IAccountRepository';
import AccountRepository from '@modules/accounts/infra/typeorm/repositories/AccountRepository';
import IRestaurantRepository from '@modules/restaurant/repositories/IRestaurantRepository';
import RestaurantRepository from '@modules/restaurant/infra/typeorm/repositories/RestaurantRepository';

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository,
);

container.registerSingleton<IUserTokenRepository>(
    'UserTokenRepository',
    UserTokenRepository,
);

container.registerSingleton<IAccountRepository>(
    'AccountRepository',
    AccountRepository,
);

container.registerSingleton<IRestaurantRepository>(
    'RestaurantRepository',
    RestaurantRepository,
);
