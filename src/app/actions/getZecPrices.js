import axios from 'axios';

const ZEC_PRICES_URL = 'https://api.nanopool.org/v1/zec/prices';

export const FETCH_ZEC_PRICES = 'FETCH_ZEC_PRICES';

export function fetchZecPrices() {
    const zec_prices = axios.get(ZEC_PRICES_URL);

    return {
        type: FETCH_ZEC_PRICES,
        payload: zec_prices
    };
}
