import * as express from 'express';
import * as session from 'express-session';
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
    SaleOffer,
    PaymentTool,
    PurchaseOffer,
    Wallet,
    WalletTransaction
  ],
  synchronize: true,
  logging: true
};

export interface Request extends express.Request {
  session: {
    userId: number;
    destroy: (errorHandler: (error: any) => void) => void;
  };
}

const users = [
  {
    id: 1,
    login: 'janusz',
    password: 'tracz'
  },
  {
    id: 2,
    login: 'janusz2',
    password: 'tracz'
  }
];

createConnection(options).then(async connection => {
  // await mock();
  const app = express();

  const redirectToLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect('/login');
    } else {
      next();
    }
  };

  const redirectToHome = (req, res, next) => {
    if (req.session.userId) {
      res.redirect('/');
    } else {
      next();
    }
  };

  app.use(
    session({
      name: 'SESSION_NAME',
      resave: false,
      saveUninitialized: false,
      secret: 'SESSION_SECRET',
      cookie: {
        maxAge: 'SESSION_MAX_AGE' ? 2 * 60 * 60 * 1000 : 0,
        sameSite: true,
        sexure: 'IN_PROD' ? true : false
      }
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(requestLogger());
  app.use(routes);
  app.get('/', redirectToLogin, (req: Request, res) => {
    console.log(req.session);
    const { userId } = req.session;
    const { login } = users.find(user => user.id === userId);
    res.send(`
      <h1>Hi! ${login}</h1>
      <form method="post" action="/logout">
        <button>logout</button>
      </form>
    `);
  });
  app.get('/login', redirectToHome, (req, res) => {
    // req.session.userId = 11;
    res.send(`
    <h1>login</h1>
    <form method="post" action="/login">
      <input type="text" name="login" placeholder="login" required />
      <input type="password" name="password" placeholder="password" required />
      <input type="submit" />
    </form>
    `);
  });
  app.post('/login', redirectToHome, (req: Request, res, next) => {
    const { login, password } = req.body;
    if (login && password) {
      const user = users.find(
        user => user.login === login && user.password === password
      ); // TODO: hash pw
      console.log(login, password, user);
      if (user) {
        req.session.userId = user.id;
        return res.redirect('/');
      }
    }
  });
  app.get('/register', redirectToHome, (req, res) => {
    res.send(`
    <h1>register</h1>
    <form method="post" action="/register">
      <input type="text" name="login" placeholder="login" required />
      <input type="password" name="password" placeholder="password" required />
      <input type="submit" />
    </form>
    `);
  });
  app.post('/register', redirectToHome, (req: Request, res) => {
    const { login, password } = req.body;
    if (login && password && !users.find(user => user.login === login)) {
      const user = {
        id: users[users.length - 1].id + 1,
        login,
        password
      };
      users.push(user);
      req.session.userId = user.id;
      return res.redirect('/');
    }
  });
  app.get('/logout', redirectToLogin, (req: Request, res) => {});
  app.post('/logout', (req: Request, res) => {
    console.log('/logout');
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/login');
      }
      res.clearCookie('SESSION_NAME');
      res.redirect('/login');
    });
  });

  app.listen(3000);
  console.log('Server is running at 3000');
});
