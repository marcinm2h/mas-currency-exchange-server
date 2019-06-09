import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Client } from '../models/Client';

export const listClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repository = getRepository(Client);
    const clients = await repository.find();
    res.json(clients);
  } catch (e) {
    next();
  }
};

export const getClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repository = getRepository(Client);
    const results = await repository.findOne(req.params.id);
    return res.send(results);
  } catch (e) {
    next();
  }
};

export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repository = getRepository(Client);
    const client = await repository.create(req.body);
    const results = await repository.save(client);
    return res.send(results);
  } catch (e) {
    next();
  }
};

export const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repository = getRepository(Client);
    const client = await repository.findOne(req.params.id);
    await repository.merge(client, req.body);
    const results = await repository.save(client);
    return res.send(results);
  } catch (e) {
    next();
  }
};

export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repository = getRepository(Client);
    const results = await repository.remove(req.params.id);
    return res.send(results);
  } catch (e) {
    next();
  }
};
