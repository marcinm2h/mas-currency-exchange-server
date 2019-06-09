import { Router, Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Client } from '../models/Client';

const router = Router();

router.get(
  '/clients',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getRepository(Client);
      const clients = await repository.find();
      res.json(clients);
    } catch (e) {
      next();
    }
  }
);

router.get(
  '/clients/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getRepository(Client);
      const results = await repository.findOne(req.params.id);
      return res.send(results);
    } catch (e) {
      next();
    }
  }
);

router.post(
  '/clients',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getRepository(Client);
      const client = await repository.create(req.body);
      const results = await repository.save(client);
      return res.send(results);
    } catch (e) {
      next();
    }
  }
);

router.put(
  '/clients/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getRepository(Client);
      const client = await repository.findOne(req.params.id);
      await repository.merge(client, req.body);
      const results = await repository.save(client);
      return res.send(results);
    } catch (e) {
      next();
    }
  }
);

router.delete(
  '/clients/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getRepository(Client);
      const results = await repository.remove(req.params.id);
      return res.send(results);
    } catch (e) {
      next();
    }
  }
);

export { router as clients };
