import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import ListUsersService from './ListUsersService';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let listUsersService: ListUsersService;

describe('ListUsersService', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUsersRepository = new FakeUsersRepository();

        listUsersService = new ListUsersService(fakeUsersRepository);
    });

    it('should be able to list users', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user1 = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            password: '123456',
            profile_name: 'John',
            plan_id: plan.id,
        });

        const user2 = await fakeUsersRepository.create({
            email: 'johntre@example.com',
            password: '123456',
            profile_name: 'JohnTre',
            plan_id: plan.id,
        });

        const users = await listUsersService.execute();

        expect(users).toEqual([user1, user2]);
    });
});
