import axios from 'axios';

const KRB_STAT_URL = 'http://dsserv.de:8117/stats_address?address=KbXHPUqDQ9jJPUVM6nLcDnDkhwHYb8yifRTmKH6QsMhphzUgSRRTrDMF88nCKryhi2NmodUCZXTDZ1FS7UqKrygj99zaSRN&longpoll=false';
// const KRB_STAT_URL = 'http://dsserv.de:8117/stats_address?address=Khzm9WTK3ry1PHcqYxwVL1an5zJ5orxY2aRpfnqHc2i5KJkzxnDKzcdJRsvy9hDr16Qbx8JTR7ZQwjaRbovL9C2F1hDWjmX&longpoll=false';

export const FETCH_KRB = 'FETCH_KRB';

export function fetchKrb() {
    const krb =  axios.get(KRB_STAT_URL);

    return {
        type: FETCH_KRB,
        payload: krb
    };
}