import { FETCH_KRB } from '../actions/getKrbStat'

export default function (state = {}, action) {
    switch (action.type) {
        case FETCH_KRB:
            return { ...state, krb: action.payload.data};
    }

    return state;
}