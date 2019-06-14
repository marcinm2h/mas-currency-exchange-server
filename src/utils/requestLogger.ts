import { Request, Response, NextFunction } from 'express';

export const requestLogger = () => (
  req: Request,
  res: Response,
  next: NextFunction
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
