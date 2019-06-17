import { Router } from 'express';
import { auth } from '../auth';
import {
  createOffer,
  listOffers,
  getPurchaseOffer,
  acceptOffer,
  getSaleOffer,
  listPurchaseOffers,
  listSaleOffers,
  getUserOffers
} from '../../controllers/offers';

const router = Router();

router.post('/offers', auth.required, createOffer);

router.get('/offers', auth.required, listOffers);

router.get('/user-offers', auth.required, getUserOffers);

router.get('/offers/purchase', auth.required, listPurchaseOffers);

router.get('/offers/sale', auth.required, listSaleOffers);

router.get('/offers/purchase/:id', auth.required, getPurchaseOffer);

router.get('/offers/sale/:id', auth.required, getSaleOffer);

router.post('/offers/:id', auth.required, acceptOffer);

export { router as offers };
