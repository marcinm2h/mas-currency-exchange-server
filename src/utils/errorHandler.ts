import { Request, Response } from 'express';

export const errorHandler = () => (err: Error, req: Request, res: Response) => {
  console.log(err);
  return res.send({
    error: err.message
  });
};
