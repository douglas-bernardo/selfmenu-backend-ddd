import { ICreateNotificationDTO } from '@modules/notifications/dtos/ICreateNotificationDTO';
import { IFindAllNotificationDTO } from '@modules/notifications/dtos/IFindAllNotificationDTO';
import { INotificationsRepository } from '@modules/notifications/repositories/INotificationsRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async findById(
        notification_id: string,
    ): Promise<Notification | undefined> {
        return this.ormRepository.findOne(notification_id);
    }

    public async findAll({
        recipient_id,
        offset,
        limit,
    }: IFindAllNotificationDTO): Promise<Notification[]> {
        return this.ormRepository.find({
            where: {
                recipient_id,
            },
            skip: offset || 0, // offset
            take: limit || 10, // limit
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

    public async save(notification: Notification): Promise<Notification> {
        return this.ormRepository.save(notification);
    }
}

export default NotificationsRepository;
