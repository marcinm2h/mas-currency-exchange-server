import { Router } from 'express';
import {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/client';

const router = Router();

router.get('/clients', listClients);

router.get('/clients/:id', getClient);

router.post('/clients', createClient);

router.put('/clients/:id', updateClient);

router.delete('/clients/:id', deleteClient);

export { router as clients };
