import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import { createConnection, ConnectionOptions } from 'typeorm';
import { root } from './paths';
import { BankAccount } from './models/BankAccount';
import { Client } from './models/Client';
import { CreditCard } from './models/CreditCard';
import { Currency } from './models/Currency';
import { IdentificationDocument } from './models/IdentificationDocument';
import { Moderator } from './models/Moderator';
import { ModeratorClient } from './models/ModeratorClient';
import { PaymentOffer } from './models/PaymentOffer';
import { PurchaseOffer } from './models/PurchaseOffer';
import { Wallet } from './models/Wallet';
import { WalletTransaction } from './models/WalletTransaction';

const options: ConnectionOptions = {
  type: 'sqlite',
  database: `${root}/db.sqlite`,
  entities: [
    BankAccount,
    Client,
    CreditCard,
    Currency,
    IdentificationDocument,
    Moderator,
    ModeratorClient,
    PaymentOffer,
    PurchaseOffer,
    Wallet,
    WalletTransaction
  ],
  synchronize: true,
  logging: true
};

createConnection(options).then(connection => {
  const app = express();
  app.use(bodyParser.json());

  //FIXME: move to /routes + /controllers
  const clientRepository = connection.getRepository(Client);

  app.get('/clients', async function(req: Request, res: Response) {
    const clients = await clientRepository.find();
    res.json(clients);
  });

  app.get('/clients/:id', async function(req: Request, res: Response) {
    const results = await clientRepository.findOne(req.params.id);
    return res.send(results);
  });

  app.post('/clients', async function(req: Request, res: Response) {
    const client = await clientRepository.create(req.body);
    const results = await clientRepository.save(client);
    return res.send(results);
  });

  app.put('/clients/:id', async function(req: Request, res: Response) {
    const client = await clientRepository.findOne(req.params.id);
    await clientRepository.merge(client, req.body);
    const results = await clientRepository.save(client);
    return res.send(results);
  });

  app.delete('/clients/:id', async function(req: Request, res: Response) {
    const results = await clientRepository.remove(req.params.id);
    return res.send(results);
  });

  app.listen(3000);

  console.log('Server is running at 3000');
});
