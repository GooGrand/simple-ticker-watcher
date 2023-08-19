import { Client } from "pg";

export class DbOps {
    constructor(dbUrl: string) {
        this.client = new Client(process.env.DATABASE_URL);
    }

    client: Client

    async getTickers(): Promise<Record<number, string>> {
        return (await this.client.query("SELECT ticker FROM tickers;")).rows.reduce((acc, [id, ticker]) => (acc[id] = ticker, acc), {} as Record<number, string>)
    }

    // accepts ticker id
    async setPrices(prices: Record<number, string>) {

    }
}
