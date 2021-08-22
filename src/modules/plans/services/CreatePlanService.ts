import { getRepository } from 'typeorm';
import Plan from '../infra/typeorm/entities/Plan';

interface IRequest {
    name: string;
    description: string;
}
class CreatePlanService {
    public async execute({ name, description }: IRequest): Promise<Plan> {
        const planRepository = getRepository(Plan);

        const plan = planRepository.create({
            name,
            description,
        });

        await planRepository.save(plan);
        return plan;
    }
}

export default CreatePlanService;
