import axios from 'axios';

const XMR_STAT_URL = 'http://api.minexmr.com:8080/get_wid_stats?address=4AF4HTbwQ3d9SbdKNUsPU39HTuLwEMtcY3mmTwtufSPPDbqBsUSsskq7tXDfNDZ8bj6T3Wyv9yY2xcH8FN2i36ZjD2RW4e6';

export const FETCH_XMR_STAT = 'FETCH_XMR_STAT';

export function fetchXmrStat() {
    const xmr_stat =  axios.get(XMR_STAT_URL);

    return {
        type: FETCH_XMR_STAT,
        payload: xmr_stat
    };
}