import Plan from '../infra/typeorm/entities/Plan';

export default interface IPlanRepository {
    findAll(): Promise<Plan[]>;
    findById(plan_id: number): Promise<Plan | undefined>;
    create(name: string, description: string): Promise<Plan>;
}
