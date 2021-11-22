import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import IFindAllNotificationDTO from '../dtos/IFindAllNotificationDTO';
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
    create(data: ICreateNotificationDTO): Promise<Notification>;
    findAll(data: IFindAllNotificationDTO): Promise<Notification[]>;
}
