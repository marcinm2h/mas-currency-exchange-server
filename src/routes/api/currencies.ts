import { Router } from 'express';
import { listCurrencies } from '../../controllers/currency';
import { auth } from '../auth';

const router = Router();

router.get('/currencies', auth.required, listCurrencies);

export { router as clients };
