import { Router } from 'express';
import { auth } from '../auth';
import {
  createOffer,
  listOffers,
  getPurchaseOffer,
  deleteOffer,
  acceptOffer,
  getSaleOffer
} from '../../controllers/offers';

const router = Router();

router.post('/offers', auth.required, createOffer);

router.get('/offers', auth.required, listOffers);

router.get('/offers/purchase/:id', auth.required, getPurchaseOffer);

router.get('/offers/sale/:id', auth.required, getSaleOffer);

router.delete('/offers/:id', auth.required, deleteOffer);

router.post('/offers/:id', auth.required, acceptOffer);

export { router as offers };
