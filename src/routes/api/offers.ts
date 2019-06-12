import { Router } from 'express';
import { auth } from '../auth';
import {
  createOffer,
  listOffers,
  getPurchaseOffer,
  deleteOffer,
  acceptOffer,
  getSaleOffer,
  listPurchaseOffers,
  listSaleOffers
} from '../../controllers/offers';

const router = Router();

router.post('/offers', auth.required, createOffer);

router.get('/offers', auth.required, listOffers);

router.get('/offers/purchase', auth.required, listPurchaseOffers);

router.get('/offers/sale', auth.required, listSaleOffers);

router.get('/offers/purchase/:id', auth.required, getPurchaseOffer);

router.get('/offers/sale/:id', auth.required, getSaleOffer);

router.delete('/offers/:id', auth.required, deleteOffer);

router.post('/offers/:id', auth.required, acceptOffer);

export { router as offers };
