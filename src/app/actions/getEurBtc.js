import axios from 'axios';

const EUR_BTC = 'https://api.coindesk.com/v1/bpi/currentprice/EUR.json';

export const FETCH_EUR_BTC = 'FETCH_EUR_BTC';

export function fetchEurBtc() {
    const eur_btc =  axios.get(EUR_BTC);

    return {
        type: FETCH_EUR_BTC,
        payload: eur_btc
    };
}
