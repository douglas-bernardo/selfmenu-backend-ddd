import { injectable, inject } from 'tsyringe';
import Menu from '../infra/typeorm/entities/Menu';
import IMenuRepository from '../repositories/IMenuRepository';

interface IRequest {
    user_id?: string;
}

@injectable()
class ListMenuService {
    constructor(
        @inject('MenuRepository') private menuRepository: IMenuRepository,
    ) {}

    public async execute({ user_id }: IRequest): Promise<Menu[]> {
        return this.menuRepository.findAll(user_id);
    }
}

export default ListMenuService;
