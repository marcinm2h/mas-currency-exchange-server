import { Router } from 'express';
import {
  listClients,
  getClient,
  register,
  createIdDocument,
  login,
  logout
} from '../../controllers/client';
import { auth } from '../auth';

const router = Router();

router.post('/clients-register', register);

router.post('/clients-login', login);

router.post('/clients-logout', auth.required, logout);

router.get('/clients', auth.required, listClients);

router.get('/clients/:id', auth.required, getClient);

router.post('/clients/:id/create-id-document', auth.required, createIdDocument);

export { router as clients };
