import { Router } from 'express';
import UpdateTableTokenController from '../controllers/UpdateTableTokenController';

const tableTokensRouter = Router({ mergeParams: true });

const updateTokenTable = new UpdateTableTokenController();

tableTokensRouter.post('/', updateTokenTable.create);

export default tableTokensRouter;
