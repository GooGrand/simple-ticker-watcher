// key = tickerId, value = price
export type Prices = Record<number, string>;
// key = tickerId, value = ticker
export type Tickers = Record<number, string>;

export interface TickerData {
    date: string,
    base: string,
    rates: PriceTickers
}

interface PriceTickers {
    [key: string]: string
}

export enum ReqType {
    Pair = 'pair',
    Date = 'date'
}