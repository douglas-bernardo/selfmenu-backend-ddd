import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserTokenRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';
import IRestaurantRepository from '@modules/restaurant/repositories/IRestaurantRepository';
import RestaurantRepository from '@modules/restaurant/infra/typeorm/repositories/RestaurantRepository';
import IPlanRepository from '@modules/users/repositories/IPlanRepository';
import PlanRepository from '@modules/users/infra/typeorm/repositories/PlanRepository';
import IMenuRepository from '@modules/menu/repositories/IMenuRepository';
import MenuRepository from '@modules/menu/infra/typeorm/repositories/MenuRepository';
import IItemRepository from '@modules/item/repositories/IItemRepository';
import ItemRepository from '@modules/item/infra/typeorm/repositories/ItemRepository';
import WaiterRepository from '@modules/waiter/infra/typeorm/repositories/WaiterRepository';
import IWaiterRepository from '@modules/waiter/repositories/IWaiterRepository';

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository,
);

container.registerSingleton<IUserTokenRepository>(
    'UserTokenRepository',
    UserTokenRepository,
);

container.registerSingleton<IRestaurantRepository>(
    'RestaurantRepository',
    RestaurantRepository,
);

container.registerSingleton<IPlanRepository>('PlanRepository', PlanRepository);

container.registerSingleton<IMenuRepository>('MenuRepository', MenuRepository);

container.registerSingleton<IItemRepository>('ItemRepository', ItemRepository);

container.registerSingleton<IWaiterRepository>(
    'WaiterRepository',
    WaiterRepository,
);
