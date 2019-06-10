import * as express from 'express';
import { clients } from './clients';

const router = express.Router();

router.use(clients);

export { router as api };
