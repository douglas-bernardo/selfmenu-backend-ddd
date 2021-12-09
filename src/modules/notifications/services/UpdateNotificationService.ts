import { injectable, inject } from 'tsyringe';

import Notification from '../infra/typeorm/schemas/Notification';
import { INotificationsRepository } from '../repositories/INotificationsRepository';

interface IRequest {
    id: string;
}

@injectable()
class UpdateNotificationService {
    constructor(
        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,
    ) {}

    public async execute({ id }: IRequest): Promise<Notification> {
        const notification = await this.notificationsRepository.findById(id);

        if (!notification) {
            throw new Error('Notification not found');
        }

        notification.read = true;

        return this.notificationsRepository.save(notification);
    }
}

export default UpdateNotificationService;
