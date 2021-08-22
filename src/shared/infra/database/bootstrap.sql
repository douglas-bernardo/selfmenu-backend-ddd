-- CREATE DATABASE selfmenu default charset utf8 collate utf8_general_ci;

use selfmenu;

-- plans types
insert into plan (name, description) values ('Free', 'Description of Free plan');
insert into plan (name, description) values ('Premium', 'Description of Premium plan');

-- restaurant types
insert into restaurant_type (name) values ('Restaurante Típico');
insert into restaurant_type (name) values ('Restaurante Grill');
insert into restaurant_type (name) values ('Jantar Fino');
insert into restaurant_type (name) values ('Pub');
insert into restaurant_type (name) values ('Lanchonete');
insert into restaurant_type (name) values ('Pastelaria');
insert into restaurant_type (name) values ('Café ou Bistrô');
insert into restaurant_type (name) values ('Food Truck');
insert into restaurant_type (name) values ('Hamburgueria');
insert into restaurant_type (name) values ('Pizzaria');