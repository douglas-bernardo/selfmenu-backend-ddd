import ListNotificationsService from '@modules/notifications/services/ListNotificationsService';
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
}
