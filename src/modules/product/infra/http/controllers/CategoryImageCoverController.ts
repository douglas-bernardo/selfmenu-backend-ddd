import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateCategoryImageCoverService from '@modules/product/services/UpdateCategoryImageCoverService';

export default class CategoryImageCoverController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const updateCategoryImageCover = container.resolve(
            UpdateCategoryImageCoverService,
        );

        const account = await updateCategoryImageCover.execute({
            category_id: id,
            owner_id: request.account.id,
            imageCoverFilename: String(request.file?.filename),
        });

        return response.json(classToClass(account));
    }
}
