import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfileService = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to show profile', async () => {
        const user = await fakeUsersRepository.create({
            first_name: 'John Doe',
            last_name: 'Brow',
            email: 'john@example.com',
            password: '123456',
        });

        const profile = await showProfileService.execute({
            user_id: user.id,
        });

        expect(profile.email).toBe('john@example.com');
    });

    it('should not be able to show profile from non-existing user', async () => {
        expect(
            showProfileService.execute({
                user_id: 'non-existing-user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
