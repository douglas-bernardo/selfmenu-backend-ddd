import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateCategoryImageCoverService from '@modules/item/services/UpdateCategoryImageCoverService';

export default class CategoryImageCoverController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const updateCategoryImageCover = container.resolve(
            UpdateCategoryImageCoverService,
        );

        const user = await updateCategoryImageCover.execute({
            category_id: id,
            owner_id: request.user.id,
            imageCoverFilename: String(request.file?.filename),
        });

        return response.json(classToClass(user));
    }
}
