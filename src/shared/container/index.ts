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
import ITableRepository from '@modules/table/repositories/ITableRepository';
import TableRepository from '@modules/table/infra/typeorm/repositories/TableRepository';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import OrdersRepository from '@modules/order/infra/typeorm/repositories/OrderRepository';
import ICategoryRepository from '@modules/item/repositories/ICategoryRepository';
import CategoryRepository from '@modules/item/infra/typeorm/repositories/CategoryRepository';

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

container.registerSingleton<ICategoryRepository>(
    'CategoryRepository',
    CategoryRepository,
);

container.registerSingleton<IItemRepository>('ItemRepository', ItemRepository);

container.registerSingleton<IWaiterRepository>(
    'WaiterRepository',
    WaiterRepository,
);

container.registerSingleton<ITableRepository>(
    'TableRepository',
    TableRepository,
);

container.registerSingleton<IOrderRepository>(
    'OrderRepository',
    OrdersRepository,
);
