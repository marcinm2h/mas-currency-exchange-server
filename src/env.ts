import * as dotenv from 'dotenv';
import { root } from './paths';

dotenv.config();

const TEN_HOURS = 10 * 60 * 60 * 1000;

export const {
  SESSION_NAME = 'sid',
  SESSION_SECRET = '4a345091',
  SESSION_MAX_AGE = TEN_HOURS,
  DB_PATH = `${root}/db.sqlite`
} = process.env;
