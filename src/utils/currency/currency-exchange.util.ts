import { oneDayInSec } from "@/constants/time.constant";
import redis from "@/utils/redis/redis.instance.util";
import axios from "axios";
const config = require('config');
const currency_exchange_server = config.get('currency_exchange_server');

//Exchange currency unit
/*
* @param amount: number - the amount to be exchanged
* @param source_currency: string - the currency to be exchanged
* @param dest_currency: string - the currency to be exchanged to
*/
export async function currencyExchange(amount: number, source_currency: string, dest_currency: string): Promise<number> {
  // Check if the source_currency is in the cache
  let rates : any;
  rates = await redis.get(`currency::${source_currency}`);
    if (rates){
        rates = JSON.parse(rates);
        if (!rates[dest_currency]){
            throw new Error('Invalid currency');
        }
        return Number(amount) * Number(rates[dest_currency]);
  }
  
  //If the source_currency is not in the cache, fetch the exchange rate from the currency exchange server
    const exchangeRate = await axios.get(`${currency_exchange_server}/${source_currency}`);
    rates = exchangeRate.data.rates;
    await redis.set(`currency::${source_currency}`, JSON.stringify(rates), 'EX', oneDayInSec);
    if (!rates[dest_currency]){
        throw new Error('Invalid currency');
    }
    return Number(amount) * Number(rates[dest_currency]);

}