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

  app.use(routes);

  app.listen(3000);

  console.log('Server is running at 3000');
});
