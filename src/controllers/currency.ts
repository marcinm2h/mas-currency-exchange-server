import { NextFunction, Response } from 'express';
import { getRepository } from 'typeorm';
import { Request } from '../routes/auth';
import { Currency } from '../models/Currency';

export const listCurrencies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currencyRepository = getRepository(Currency);
    const currencies = await currencyRepository.find();

    res.json({
      data: currencies
    });
  } catch (e) {
    next(e);
  }
};
