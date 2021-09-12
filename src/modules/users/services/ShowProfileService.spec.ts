import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUsersRepository = new FakeUsersRepository();

        showProfileService = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to show profile', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            password: '123456',
            profile_name: 'John',
            plan_id: plan.id,
        });

        const profile = await showProfileService.execute({
            user_id: user.id,
        });

        expect(profile.email).toBe('johndoe@example.com');
    });

    it('should not be able to show profile from non-existing user', async () => {
        await expect(
            showProfileService.execute({
                user_id: 'non-existing-user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
