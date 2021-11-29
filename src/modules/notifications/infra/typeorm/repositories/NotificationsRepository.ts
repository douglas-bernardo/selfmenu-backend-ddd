import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import IFindAllNotificationDTO from '@modules/notifications/dtos/IFindAllNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async findAll({
        recipient_id,
    }: IFindAllNotificationDTO): Promise<Notification[]> {
        console.log(recipient_id);
        return this.ormRepository.find({
            where: {
                recipient_id,
            },
            order: {
                created_at: 'DESC',
            },
        });
    }

    public async create({
        content,
        recipient_id,
        establishment_id,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            content,
            recipient_id,
            establishment_id,
        });

        await this.ormRepository.save(notification);

        return notification;
    }
}

export default NotificationsRepository;
