import * as express from 'express';
import { NextFunction, Response } from 'express';

export interface Request extends express.Request {
  sessionID: string;
  session: {
    userId: number;
    login: string;
    destroy: (onFinish: (error: any) => void) => void;
  };
}

export const auth = {
  required: (req: Request, res: Response, next: NextFunction) => {
    return next(); //FIXME: tyko dewelopersko!
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
    <form method="post" action="/api/clients-logout">
      <button>logout</button>
    </form>
  `);
});

router.get('/login', (req: Request, res: Response, next: NextFunction) => {
  res.send(`
  <h1>login</h1>
  <form method="post" action="/api/clients-login">
    <input type="text" name="login" placeholder="login" required />
    <input type="password" name="password" placeholder="password" required />
    <input type="submit" />
  </form>
  `);
});

router.get('/register', (req: Request, res: Response, next: NextFunction) => {
  res.send(`
  <h1>register</h1>
  <form method="post" action="/api/clients-register">
    <label>login:
      <input type="text" name="login" placeholder="login" required />
    </label>
    <br />
    <label>password:
      <input type="password" name="password" placeholder="password" required />
    </label>
    <br />
    <label>firstName:
      <input type="text" name="firstName" placeholder="firstName" required />
    </label>
    <br />
    <label>lastName:
      <input type="text" name="lastName" placeholder="lastName" required />
    </label>
    <br />
    <label>PESEL:
      <input type="text" name="PESEL" placeholder="PESEL" required />
    </label>
    <br />
    <label>birthday:
      <input type="date" name="birthday" placeholder="birthday" required />
    </label>
    <br />
    <label>mail:
      <input type="mail" name="mail" placeholder="mail" required />
    </label>
    <input type="submit" />
  </form>
  `);
});

export { router as authRoutes };
