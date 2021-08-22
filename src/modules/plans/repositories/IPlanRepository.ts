import Plan from '../infra/typeorm/entities/Plan';

export default interface IPlanRepository {
    create(name: string, description: string): Promise<Plan>;
}
