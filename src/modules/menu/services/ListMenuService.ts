import { injectable, inject } from 'tsyringe';
import Menu from '../infra/typeorm/entities/Menu';
import IMenuRepository from '../repositories/IMenuRepository';

interface IRequest {
    account_id?: string;
}

@injectable()
class ListMenuService {
    constructor(
        @inject('MenuRepository') private menuRepository: IMenuRepository,
    ) {}

    public async execute({ account_id }: IRequest): Promise<Menu[]> {
        return this.menuRepository.findAll({ owner_id: account_id });
    }
}

export default ListMenuService;
