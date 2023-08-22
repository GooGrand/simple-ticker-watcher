import { Prices, Tickers, TickerData } from "./types";

const baseUrl = "https://api.currencyfreaks.com/v2.0/rates/latest";

export function constructUrl(apikey: string): string {
    return `${baseUrl}?apikey=${apikey}`;
}

export async function fetchTickers(tickers: Tickers, apikey: string): Promise<Prices> {
    const res = await fetch(constructUrl(apikey));
    const json = (await res.json()) as TickerData;
    let prices = {} as Record<string, string>;
    for (const key in tickers) {
        prices[key] = json.rates[tickers[key]];
    }
    return prices;
}

export function currentDate(): string {
    const now = new Date();
    return now.toISOString().split("T")[0]
}

const validDate = new RegExp("^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$");

export function isValidDate(date: string): boolean {
    return validDate.test(date);
} 

export function calculateRate(prices: Record<string, string>, from: string, to: string): string {
    return (+prices[from] / +prices[to]).toString()
}