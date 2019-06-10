import * as express from 'express';
import { clients } from './clients';
import { offers } from './offers';

const router = express.Router();

router.use(clients);

router.use(offers);

export { router as api };
