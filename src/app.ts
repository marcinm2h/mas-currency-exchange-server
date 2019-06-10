import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import { createConnection, ConnectionOptions } from 'typeorm';
import { DB_PATH, SESSION_SECRET, SESSION_NAME, SESSION_MAX_AGE } from './env';
import { routes } from './routes';
import { BankAccount } from './models/BankAccount';
import { Client } from './models/Client';
import { CreditCard } from './models/CreditCard';
import { Currency } from './models/Currency';
import { IdDocument } from './models/IdDocument';
import { Moderator } from './models/Moderator';
import { ModeratorClient } from './models/ModeratorClient';
import { Offer } from './models/abstracts/Offer';
import { SaleOffer } from './models/SaleOffer';
import { PaymentTool } from './models/abstracts/PaymentTool';
import { PurchaseOffer } from './models/PurchaseOffer';
import { Wallet } from './models/Wallet';
import { WalletTransaction } from './models/WalletTransaction';
import { mock } from './mocks';

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

const errorHandler = () => (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(err);
  next();
};

const connectionOptions: ConnectionOptions = {
  type: 'sqlite',
  database: DB_PATH,
  entities: [
    BankAccount,
    Client,
    CreditCard,
    Currency,
    IdDocument,
    Moderator,
    ModeratorClient,
    Offer,
    SaleOffer,
    PaymentTool,
    PurchaseOffer,
    Wallet,
    WalletTransaction
  ],
  synchronize: true,
  logging: true
};

createConnection(connectionOptions).then(async connection => {
  await mock();
  const app = express();
  app.use(
    session({
      secret: SESSION_SECRET,
      name: SESSION_NAME,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: SESSION_MAX_AGE,
        sameSite: true,
        sexure: false
      }
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(requestLogger());
  app.use(routes);
  app.use(errorHandler());
  app.listen(3000);
  console.log('Server is running at 3000');
});
