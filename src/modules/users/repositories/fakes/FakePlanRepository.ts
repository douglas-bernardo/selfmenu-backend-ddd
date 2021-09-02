import Plan from '@modules/users/infra/typeorm/entities/Plan';
import IPlanRepository from '../IPlanRepository';

class FakePlanRepository implements IPlanRepository {
    private plans: Plan[] = [];

    public async findAll(): Promise<Plan[]> {
        return this.plans;
    }

    public async findById(plan_id: number): Promise<Plan | undefined> {
        const findPlan = this.plans.find(plan => plan.id === plan_id);

        return findPlan;
    }

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
