import axios from 'axios';

const ZEC_STAT_URL = 'https://zec.nanopool.org/api/v1/load_account/t1XvihirZfXN6Ne1qhiqw2VZPTX3xfq43mq';

export const FETCH_ZEC_STAT = 'FETCH_ZEC_STAT';

export function fetchZecStat() {
    const zec_stat =  axios.get(ZEC_STAT_URL);

    return {
        type: FETCH_ZEC_STAT,
        payload: zec_stat
    };
}
