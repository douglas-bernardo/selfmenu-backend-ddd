import { Router } from 'express';
import UpdateTableTokenController from '../controllers/UpdateTableTokenController';

const tokenTable = Router();

const updateTokenTable = new UpdateTableTokenController();

tokenTable.post('/', updateTokenTable.create);

export default tokenTable;
