import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Client } from '../models/Client';
import { IdDocument } from '../models/IdDocument';
import { Currency } from '../models/Currency';
import { Wallet } from '../models/Wallet';

export const listClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientRepository = getRepository(Client);
    const clients = await clientRepository.find({ relations: ['wallets'] }); // FIXME: no wallets
    res.json(clients);
  } catch (e) {
    next(e);
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
    next(e);
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
      password,
      firstName,
      lastName,
      PESEL,
      contactAddress,
      birthday
    } = req.body;

    const clientRepository = getRepository(Client);
    const client = new Client();
    client.login = login;
    client.password = password;
    client.firstName = firstName;
    client.lastName = lastName;
    client.PESEL = PESEL;
    client.contactAddress = contactAddress;
    client.birthday = new Date(birthday);

    const results = await clientRepository.save(client);

    const currencyRepository = getRepository(Currency);
    const currencies = await currencyRepository.find();

    const wallets = currencies.map(currency => {
      const wallet = new Wallet();
      wallet.balance = 0;
      wallet.currency = currency;
      wallet.owner = client;
      return wallet;
    });
    const walletRepository = getRepository(Wallet);
    await walletRepository.save(wallets);

    return res.send(results);
  } catch (e) {
    next(e);
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
    next(e);
  }
};
