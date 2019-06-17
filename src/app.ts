import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import { createConnection, ConnectionOptions } from 'typeorm';
import { DB_PATH, SESSION_SECRET, SESSION_NAME, SESSION_MAX_AGE } from './env';
import { routes } from './routes';
import { mock } from './mocks';
import { errorHandler, requestLogger } from './utils';
import {
  BankAccount,
  Client,
  CreditCard,
  Currency,
  IdDocument,
  ModeratorClient,
  Offer,
  SaleOffer,
  PaymentTool,
  PurchaseOffer,
  Wallet,
  WalletTransaction,
  Moderator
} from './models';

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
    PaymentTool,
    PurchaseOffer,
    SaleOffer,
    Wallet,
    WalletTransaction
  ],
  synchronize: true,
  logging: true
};

createConnection(connectionOptions).then(async connection => {
  // await mock();
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
