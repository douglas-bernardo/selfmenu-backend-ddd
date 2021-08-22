import Plan from '@modules/plans/infra/typeorm/entities/Plan';
import IPlanRepository from '../IPlanRepository';

class FakePlanRepository implements IPlanRepository {
    private plans: Plan[] = [];

    public async create(name: string, description: string): Promise<Plan> {
        const plan = new Plan();

        const lastStoredPlan = this.plans[this.plans.length - 1];

        Object.assign(plan, {
            id: lastStoredPlan ? lastStoredPlan.id + 1 : 1,
            name,
            description,
        });

        this.plans.push(plan);
        return plan;
    }
}

export default FakePlanRepository;
