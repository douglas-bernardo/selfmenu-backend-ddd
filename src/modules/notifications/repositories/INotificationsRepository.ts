import { ICreateNotificationDTO } from '../dtos/ICreateNotificationDTO';
import { IFindAllNotificationDTO } from '../dtos/IFindAllNotificationDTO';
import Notification from '../infra/typeorm/schemas/Notification';

export interface INotificationsRepository {
    create(data: ICreateNotificationDTO): Promise<Notification>;
    findById(notification_id: string): Promise<Notification | undefined>;
    findAll(data: IFindAllNotificationDTO): Promise<Notification[]>;
    save(notification: Notification): Promise<Notification>;
}
