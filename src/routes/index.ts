import * as express from 'express';
import { clients } from './clients';

const router = express.Router();

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

router.get('/', redirectToLogin, (req: Request, res) => {
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
router.get('/login', redirectToHome, (req, res) => {
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
router.post('/login', redirectToHome, (req: Request, res, next) => {
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
router.get('/register', redirectToHome, (req, res) => {
  res.send(`
  <h1>register</h1>
  <form method="post" action="/register">
    <input type="text" name="login" placeholder="login" required />
    <input type="password" name="password" placeholder="password" required />
    <input type="submit" />
  </form>
  `);
});
router.post('/register', redirectToHome, (req: Request, res) => {
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
router.get('/logout', redirectToLogin, (req: Request, res) => {});
router.post('/logout', (req: Request, res) => {
  console.log('/logout');
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/login');
    }
    res.clearCookie('SESSION_NAME');
    res.redirect('/login');
  });
});

router.use(clients);

export { router as routes };
