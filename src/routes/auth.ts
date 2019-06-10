import * as express from 'express';
import { NextFunction, Response } from 'express';
import { getRepository } from 'typeorm';
import { Client } from '../models/Client';
import { SESSION_NAME } from '../env';

interface Request extends express.Request {
  session: {
    userId: number;
    login: string;
    destroy: (onFinish: (error: any) => void) => void;
  };
}

export const auth = {
  required: (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.sendStatus(401);
    }
    next();
  }
};

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { userId, login } = req.session;
  if (userId === undefined) {
    return res.redirect('/login');
  }

  res.send(`
    <h1>Hi! ${login}</h1>
    <form method="post" action="/api/logout">
      <button>logout</button>
    </form>
  `);
});

router.get('/login', (req: Request, res: Response, next: NextFunction) => {
  res.send(`
  <h1>login</h1>
  <form method="post" action="/api/login">
    <input type="text" name="login" placeholder="login" required />
    <input type="password" name="password" placeholder="password" required />
    <input type="submit" />
  </form>
  `);
});

router.post(
  '/api/login',
  async (req: Request, res: Response, next: NextFunction) => {
    const { login, password } = req.body;
    if (login && password) {
      const clientRepository = getRepository(Client); //FIXME: clientController.login({ login, password })
      const client = await clientRepository.findOne({ login, password }); //TODO: password hashing
      if (client) {
        req.session.userId = client.id;
        req.session.login = login;
        return res.redirect('/');
      }
      return res.send({ error: 'Wrong login or password' }); //FIXME: error_codes
    }
    return res.send({ error: 'Type in login and password' }); //FIXME: error_codes
  }
);

router.get('/register', (req: Request, res: Response, next: NextFunction) => {
  res.send(`
  <h1>register</h1>
  <form method="post" action="/api/register">
    <input type="text" name="login" placeholder="login" required />
    <input type="password" name="password" placeholder="password" required />
    <input type="submit" />
  </form>
  `);
});

router.post(
  '/api/register',
  async (req: Request, res: Response, next: NextFunction) => {
    const { login, password } = req.body;
    if (login && password) {
      const clientRepository = getRepository(Client); //FIXME: clientController.checkLogin({ login, password })
      const loginInUse = Boolean(await clientRepository.findOne({ login })); //TODO: password hashing
      if (loginInUse) {
        return res.send({
          error: 'Login already in use. Choose another login.'
        }); //FIXME: error_codes
      }
      const client = new Client();
      client.login = login;
      client.password = password;
      client.firstName = '';
      client.lastName = '';
      client.birthday = new Date();
      client.PESEL = '';
      client.mail = '';
      client.contactAddress = '';
      const result = await clientRepository.save(client);
      req.session.userId = result.id;
      req.session.login = result.login; //setSessiotn();
      return res.redirect('/');
    }
  }
);

router.post('/api/logout', auth.required, (req: Request, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie(SESSION_NAME);
    res.redirect('/');
  });
});

export { router as authRoutes };
