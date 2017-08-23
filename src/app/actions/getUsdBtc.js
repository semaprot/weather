import axios from 'axios';

const USD_BTC = 'https://blockchain.info/tobtc?currency=USD&value=1';

export const FETCH_USD_BTC = 'FETCH_USD_BTC';

export function fetchUsdBtc() {
    const usd_btc =  axios.get(USD_BTC)

    return {
        type: FETCH_USD_BTC,
        payload: usd_btc
    };
}
