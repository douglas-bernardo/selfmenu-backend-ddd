import ListNotificationsService from '@modules/notifications/services/ListNotificationsService';
import UpdateNotificationService from '@modules/notifications/services/UpdateNotificationService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class NotificationsController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const owner_id = request.account.id;
        const listNotificationsService = container.resolve(
            ListNotificationsService,
        );

        const notifications = await listNotificationsService.execute({
            owner_id,
        });

        return response.json(notifications);
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;

        const updateNotificationService = container.resolve(
            UpdateNotificationService,
        );

        const notification = await updateNotificationService.execute({ id });

        return response.json(notification);
    }
}
