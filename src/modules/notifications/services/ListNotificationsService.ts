import { injectable, inject } from 'tsyringe';

import Notification from '../infra/typeorm/schemas/Notification';
import { INotificationsRepository } from '../repositories/INotificationsRepository';

interface IRequest {
    owner_id: string;
}

@injectable()
class ListNotificationsService {
    constructor(
        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,
    ) {}

    public async execute({ owner_id }: IRequest): Promise<Notification[]> {
        return this.notificationsRepository.findAll({
            recipient_id: owner_id,
        });
    }
}

export default ListNotificationsService;
