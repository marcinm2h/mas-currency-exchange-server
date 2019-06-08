import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import { createConnection, ConnectionOptions } from 'typeorm';
import { User } from './entity/User';
import { root } from './paths';
import { Money } from './entity/Money';

const options: ConnectionOptions = {
  type: 'sqlite',
  database: `${root}/db.sqlite`,
  entities: [User, Money],
  synchronize: true,
  logging: true
};

createConnection(options).then(connection => {
  const userRepository = connection.getRepository(User);

  // create and setup express app
  const app = express();
  app.use(bodyParser.json());

  // register routes

  app.get('/users', async function(req: Request, res: Response) {
    const users = await userRepository.find();
    res.json(users);
  });

  app.get('/users/:id', async function(req: Request, res: Response) {
    const results = await userRepository.findOne(req.params.id);
    return res.send(results);
  });

  app.post('/users', async function(req: Request, res: Response) {
    const user = await userRepository.create(req.body);
    const results = await userRepository.save(user);
    return res.send(results);
  });

  app.put('/users/:id', async function(req: Request, res: Response) {
    const user = await userRepository.findOne(req.params.id);
    await userRepository.merge(user, req.body);
    const results = await userRepository.save(user);
    return res.send(results);
  });

  app.delete('/users/:id', async function(req: Request, res: Response) {
    const results = await userRepository.remove(req.params.id);
    return res.send(results);
  });

  app.listen(3000);
  console.log('Server is running at 3000');
});
