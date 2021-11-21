import { container } from 'tsyringe';

import '@modules/account/providers';
import './providers';

import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import AccountsRepository from '@modules/account/infra/typeorm/repositories/AccountRepository';

import IAccountTokenRepository from '@modules/account/repositories/IAccountTokenRepository';
import AccountTokenRepository from '@modules/account/infra/typeorm/repositories/AccountTokenRepository';

import IEstablishmentRepository from '@modules/establishment/repositories/IEstablishmentRepository';
import EstablishmentRepository from '@modules/establishment/infra/typeorm/repositories/EstablishmentRepository';

import IEstablishmentTypeRepository from '@modules/establishment/repositories/IEstablishmentTypeRepository';
import EstablishmentTypeRepository from '@modules/establishment/infra/typeorm/repositories/EstablishmentTypeRepository';

import IPlanRepository from '@modules/account/repositories/IPlanRepository';
import PlanRepository from '@modules/account/infra/typeorm/repositories/PlanRepository';

import IMenuRepository from '@modules/menu/repositories/IMenuRepository';
import MenuRepository from '@modules/menu/infra/typeorm/repositories/MenuRepository';

import IProductRepository from '@modules/product/repositories/IProductRepository';
import ProductRepository from '@modules/product/infra/typeorm/repositories/ProductRepository';

import WaiterRepository from '@modules/waiter/infra/typeorm/repositories/WaiterRepository';
import IWaiterRepository from '@modules/waiter/repositories/IWaiterRepository';

import ITableRepository from '@modules/table/repositories/ITableRepository';
import TableRepository from '@modules/table/infra/typeorm/repositories/TableRepository';

import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import OrdersRepository from '@modules/order/infra/typeorm/repositories/OrderRepository';

import ICategoryRepository from '@modules/product/repositories/ICategoryRepository';
import CategoryRepository from '@modules/product/infra/typeorm/repositories/CategoryRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<IAccountsRepository>(
    'AccountsRepository',
    AccountsRepository,
);

container.registerSingleton<IAccountTokenRepository>(
    'AccountTokenRepository',
    AccountTokenRepository,
);

container.registerSingleton<IEstablishmentRepository>(
    'EstablishmentRepository',
    EstablishmentRepository,
);

container.registerSingleton<IEstablishmentTypeRepository>(
    'EstablishmentTypeRepository',
    EstablishmentTypeRepository,
);

container.registerSingleton<IPlanRepository>('PlanRepository', PlanRepository);

container.registerSingleton<IMenuRepository>('MenuRepository', MenuRepository);

container.registerSingleton<ICategoryRepository>(
    'CategoryRepository',
    CategoryRepository,
);

container.registerSingleton<IProductRepository>(
    'ProductRepository',
    ProductRepository,
);

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

container.registerSingleton<INotificationsRepository>(
    'NotificationsRepository',
    NotificationsRepository,
);
