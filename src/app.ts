import * as express from 'express';
import * as bodyParser from 'body-parser';
import { createConnection, ConnectionOptions } from 'typeorm';
import { root } from './paths';
import { routes } from './routes';
import { BankAccount } from './models/BankAccount';
import { Client } from './models/Client';
import { CreditCard } from './models/CreditCard';
import { Currency } from './models/Currency';
import { IdentificationDocument } from './models/IdentificationDocument';
import { Moderator } from './models/Moderator';
import { ModeratorClient } from './models/ModeratorClient';
import { Offer } from './models/abstracts/Offer';
import { PaymentOffer } from './models/PaymentOffer';
import { PaymentTool } from './models/abstracts/PaymentTool';
import { PurchaseOffer } from './models/PurchaseOffer';
import { Wallet } from './models/Wallet';
import { WalletTransaction } from './models/WalletTransaction';
import { mockClients } from './mocks';

const requestLogger = () => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { method, body, params, url } = req;
  console.log(
    `[REQUEST] ${url}`,
    JSON.stringify({
      method,
      body,
      params
    })
  );
  next();
};

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
    Offer,
    PaymentOffer,
    PaymentTool,
    PurchaseOffer,
    Wallet,
    WalletTransaction
  ],
  synchronize: true,
  logging: true
};

createConnection(options).then(async connection => {
  await mockClients();
  const app = express();
  app.use(bodyParser.json());
  app.use(requestLogger());
  app.use(routes);
  app.listen(3000);
  console.log('Server is running at 3000');
});
