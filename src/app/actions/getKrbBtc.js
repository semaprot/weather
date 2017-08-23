import axios from 'axios';

const KRB_BTC = 'https://www.cryptopia.co.nz/api/GetMarket/KRB_BTC';

export const FETCH_KRB_BTC = 'FETCH_KRB_BTC';

export function fetchKrbBtc() {
    const krb_btc =  axios.get(KRB_BTC);

    return {
        type: FETCH_KRB_BTC,
        payload: krb_btc
    };
}
