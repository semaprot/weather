import axios from 'axios';

const XMR_USD = 'https://api.cryptonator.com/api/ticker/XMR-USD';

export const FETCH_XMR_USD = 'FETCH_XMR_USD';

export function fetchXmrUSD() {
    const xmr_usd =  axios.get(XMR_USD);

    return {
        type: FETCH_XMR_USD,
        payload: xmr_usd
    };
}
