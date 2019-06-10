import * as express from 'express';
import { api } from './api';
import { authRoutes } from './auth';

const router = express.Router();

router.use(authRoutes);
router.use('/api', api);

export { router as routes };
