import FakePlanRepository from '../repositories/fakes/FakePlanRepository';

let fakePlanRepository: FakePlanRepository;

describe('CreatePlan', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
    });

    it('should be able to create a new plan', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'A selfmenu Free plan',
        );

        expect(plan).toHaveProperty('id');
    });
});
