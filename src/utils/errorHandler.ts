import { Request, Response, NextFunction } from 'express';

export const errorHandler = () => (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  return res.json({ error: error.message });
};
