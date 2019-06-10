import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Client } from '../models/Client';
import { IdDocument } from '../models/IdDocument';

export const listClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientRepository = getRepository(Client);
    const clients = await clientRepository.find();
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
    const clientRepository = getRepository(Client);
    const results = await clientRepository.findOne(req.params.id);
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
    const {
      login,
      firstName,
      lastName,
      PESEL,
      password,
      contactAddress
    } = req.body;

    const clientRepository = getRepository(Client);
    const client = new Client();
    client.login = login;
    client.firstName = firstName;
    client.lastName = lastName;
    client.PESEL = PESEL;
    client.password = password;
    client.contactAddress = contactAddress;
    const results = await clientRepository.save(client);

    return res.send(results);
  } catch (e) {
    next();
  }
};

export const createIdDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: clientId } = req.params;
    const { idNumber, type, scannedDocumentUrl } = req.body;

    const clientRepository = getRepository(Client);
    const client = await clientRepository.findOne(clientId);
    const idDocumentRepository = getRepository(IdDocument);
    const idDocument = await idDocumentRepository.create({
      idNumber,
      type,
      scannedDocumentUrl
    });
    client.idDocument = idDocument;
    const results = await idDocumentRepository.save(idDocument);

    return res.send(results);
  } catch (e) {
    next();
  }
};
