import axios from 'axios';

const UAH_BTC = 'https://api.coindesk.com/v1/bpi/currentprice/UAH.json';

export const FETCH_UAH_BTC = 'FETCH_UAH_BTC';

export function fetchUahBtc() {
    const uah_btc =  axios.get(UAH_BTC);

    return {
        type: FETCH_UAH_BTC,
        payload: uah_btc
    };
}
