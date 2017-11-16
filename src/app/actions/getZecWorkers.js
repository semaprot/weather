import axios from 'axios';

const ZEC_WORKERS_URL = 'https://zec.nanopool.org/api/v1/workers/t1XvihirZfXN6Ne1qhiqw2VZPTX3xfq43mq/0/20/id_ASC_all';

export const FETCH_ZEC_WORKERS = 'FETCH_ZEC_WORKERS';

export function fetchZecWorkers() {
    const zec_workers =  axios.get(ZEC_WORKERS_URL);

    return {
        type: FETCH_ZEC_WORKERS,
        payload: zec_workers
    };
}
