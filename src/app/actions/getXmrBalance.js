import axios from 'axios';

const XMR_BALANCE_URL = 'http://api.minexmr.com:8080/stats_address?address=4AF4HTbwQ3d9SbdKNUsPU39HTuLwEMtcY3mmTwtufSPPDbqBsUSsskq7tXDfNDZ8bj6T3Wyv9yY2xcH8FN2i36ZjD2RW4e6';

export const FETCH_XMR_BALANCE = 'FETCH_XMR_BALANCE';

export function fetchXmrBalance() {
    const xmr_balance =  axios.get(XMR_BALANCE_URL);

    return {
        type: FETCH_XMR_BALANCE,
        payload: xmr_balance
    };
}