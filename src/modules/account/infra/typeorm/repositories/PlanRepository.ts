import IPlanRepository from '@modules/account/repositories/IPlanRepository';
import { getRepository, Repository } from 'typeorm';
import Plan from '../entities/Plan';

class PlanRepository implements IPlanRepository {
    private ormRepository: Repository<Plan>;

    constructor() {
        this.ormRepository = getRepository(Plan);
    }

    public async findAll(): Promise<Plan[]> {
        return this.ormRepository.find();
    }

    public async findById(plan_id: number): Promise<Plan | undefined> {
        const plan = await this.ormRepository.findOne({
            where: {
                id: plan_id,
            },
        });
        return plan;
    }

    public async create(name: string, description: string): Promise<Plan> {
        const plan = this.ormRepository.create({
            name,
            description,
        });

        await this.ormRepository.save(plan);

        return plan;
    }
}

export default PlanRepository;
