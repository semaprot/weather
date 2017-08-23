import axios from 'axios';

const XMR_EUR = 'https://api.cryptonator.com/api/ticker/XMR-EUR';

export const FETCH_XMR_EUR = 'FETCH_XMR_EUR';

export function fetchXmrEUR() {
    const xmr_eur =  axios.get(XMR_EUR);

    return {
        type: FETCH_XMR_EUR,
        payload: xmr_eur
    };
}
