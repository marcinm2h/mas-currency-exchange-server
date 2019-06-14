import { NextFunction, Response } from 'express';
import { getRepository } from 'typeorm';
import { Request } from '../routes/auth';
import { Client } from '../models/Client';
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
    const currencyRepository = getRepository(Currency);
    const loginInUse = Boolean(await clientRepository.findOne({ login }));
    if (loginInUse) {
      throw new Error('Login already in use. Choose another login.');
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

    return res.json({ data: results });
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
    if (!login || !password) {
      throw new Error('Type in login and password');
    }

    const clientRepository = getRepository(Client);
    const client = await clientRepository.findOne({ login, password });
    if (!client) {
      throw new Error('Wrong login or password');
    }

    req.session.userId = client.id;
    req.session.login = login;

    return res.json({
      data: {
        sid: req.sessionID,
        clientInfo: {
          clientId: client.id,
          login: client.login,
          firstName: client.firstName,
          lastName: client.lastName
        }
      }
    });
  } catch (e) {
    next(e);
  }
};

export const logout = (req: Request, res) => {
  req.session.destroy(() => {
    res.clearCookie(SESSION_NAME);
    return res.json({ data: {} });
  });
};

export const getWallets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;
    const clientRepository = getRepository(Client);
    const results = await clientRepository.findOne(userId, {
      relations: ['wallets', 'wallets.currency']
    });
    return res.json({ data: results.wallets });
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
    const { id: clientId } = req.params;
    const clientRepository = getRepository(Client);
    const results = await clientRepository.findOne(clientId);
    return res.json({ data: results });
  } catch (e) {
    next(e);
  }
};
