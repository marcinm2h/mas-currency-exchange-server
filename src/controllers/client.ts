import { NextFunction, Response } from 'express';
import { getRepository } from 'typeorm';
import { Request } from '../routes/auth';
import { Client } from '../models/Client';
import { IdDocument } from '../models/IdDocument';
import { Currency } from '../models/Currency';
import { Wallet } from '../models/Wallet';
import { SESSION_NAME } from '../env';

export const register = async (
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
      birthday,
      mail
    } = req.body;
    if (!login || !password || !firstName || !lastName || !PESEL || !birthday) {
      throw new Error('Fill in all required fields');
    }
    const clientRepository = getRepository(Client);
    const loginInUse = Boolean(await clientRepository.findOne({ login })); //TODO: password hashing
    if (loginInUse) {
      throw new Error('Login already in use. Choose another login.'); //FIXME: error_codes
    }

    const client = new Client();
    client.login = login;
    client.password = password;
    client.firstName = firstName;
    client.lastName = lastName;
    client.PESEL = PESEL;
    client.contactAddress = contactAddress;
    client.birthday = new Date(birthday);
    client.mail = mail;

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

    req.session.userId = results.id;
    req.session.login = results.login;

    return res.send(results);
  } catch (e) {
    next(e);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { login, password } = req.body;
    if (login && password) {
      const clientRepository = getRepository(Client);
      const client = await clientRepository.findOne({ login, password }); //TODO: password hashing
      if (client) {
        req.session.userId = client.id;
        req.session.login = login;

        return res.send({});
      }
      throw new Error('Wrong login or password'); //FIXME: error_codes
    }
    throw new Error('Type in login and password'); //FIXME: error_codes
  } catch (e) {
    next(e);
  }
};

export const logout = (req: Request, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie(SESSION_NAME);
    res.redirect('/');
  });
};

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
