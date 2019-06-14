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
    return next(); //FIXME: dev only
    if (!req.session.userId) {
      return res.sendStatus(401);
    }
    next();
  }
};

const router = express.Router();

export { router as authRoutes };
