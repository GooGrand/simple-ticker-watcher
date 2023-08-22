import { Client } from "pg";
import { Tickers, Prices, ReqType } from "./types";
import { currentDate } from "./helpers";

export class DbOps {
    constructor(dbUrl: string | undefined) {
        this.client = new Client(dbUrl);
    }

    client: Client;

    async connect() {
        await this.client.connect()
    }

    async getTickers(): Promise<Tickers> {
        return (await this.client.query("SELECT ticker FROM tickers;")).rows.reduce((acc, [id, ticker]) => (acc[id] = ticker, acc), {} as Record<number, string>)
    }

    async getPricesByDate(date: string): Promise<Record<string, string>> {
        const res = await this.client.query("SELECT tickers.ticker, prices.price FROM prices LEFT JOIN tickers ON prices.ticker_id=tickers.id WHERE prices.date = $1;", [date]);
        console.log(res);
        return res.rows.reduce((acc, {ticker, price}) => ({...acc, [ticker]: price}), {} as Record<string, string>);
    }

    async getPrices(from: string, to: string): Promise<Record<string, string>> {
        const date = currentDate();
        const res = await this.client.query("SELECT tickers.ticker, prices.price FROM prices LEFT JOIN tickers ON prices.ticker_id=tickers.id WHERE prices.date = $1 AND (tickers.ticker = $2 OR tickers.ticker = $3);", [date, from, to]);
        console.log(res);
        return res.rows.reduce((acc, {ticker, price}) => ({...acc, [ticker]: price}), {} as Record<string, string>);
    }

    async setPrices(prices: Prices) {
        const insertValues = recordToInsert(prices);
        const insertString = `INSERT INTO prices (ticker_id, price) ${insertValues};`;
        await this.client.query(insertString);
    }

    // probably not the best decision to use db timestamps instead of getting the instant ts on receive
    async writeLog(reqType: ReqType) {
        await this.client.query("INSERT INTO logs (request) VALUES ($1);", [reqType]);
    }

}


export function recordToInsert(record: Record<string, string>): string {
    const keys = Object.keys(record);
    return keys.reduce((acc, v) => {
        if (acc == "") {
            return `VALUES(${v}, ${record[v]})`
        } else {
            return `${acc}, VALUES(${v}, ${record[v]})`
        }
    }, "")
}