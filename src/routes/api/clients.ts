import { Router } from 'express';
import {
  listClients,
  getClient,
  createClient,
  createIdDocument
} from '../../controllers/client';

const router = Router();

router.get('/clients', listClients);

router.get('/clients/:id', getClient);

router.post('/clients', createClient);

router.post('/clients/:id/create-id-document', createIdDocument);

export { router as clients };
