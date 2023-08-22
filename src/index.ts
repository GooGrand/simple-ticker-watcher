import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {Client} from "pg"
import { DbOps } from './db';
import { ReqType } from './types';
import { calculateRate, fetchTickers } from './helpers';
import { apiKeyAuth } from '@vpriem/express-api-key-auth';
import cron from "node-cron"

dotenv.config();

const app: Express = express();
app.use(apiKeyAuth(/^API_KEY_/))
const port = process.env.PORT;

const db = new DbOps(process.env.DATABASE_URL);
// we can skip awaiting
db.connect();

cron.schedule("* 12 * * *", async () => {
  const tickers = await db.getTickers();
  const prices = await fetchTickers(tickers, process.env.POLL_API_KEY as string);
  await db.setPrices(prices);
}, {runOnInit: true})

// allow all cross domain calls
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/date', async (req: Request, res: Response) => {
  const date = req.query.date as string;
  if (date !== undefined) {
    const data = await db.getPricesByDate(date);
    await db.writeLog(ReqType.Date);
    res.send(data);
  } else {
    return res.status(403).send("Date parameter wasn't provided");
  }
});

app.get('/rate', async (req: Request, res: Response) => {
  const from = req.query.from as string;
  const to = req.query.to as string;
  const tickers = Object.values(await db.getTickers());
  if(tickers.indexOf(from) != -1 && tickers.indexOf(to) != -1) {
    const data = await db.getPrices(from, to);
    const rate = calculateRate(data, from, to);
    await db.writeLog(ReqType.Pair);
    res.send({...data, rate});
  } else {
    return res.status(403).send("Invalid ticker parameters are provided");
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});