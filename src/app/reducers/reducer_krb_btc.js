import { FETCH_KRB_BTC } from '../actions/getKrbBtc'

export default function (state = {}, action) {
    switch (action.type) {
        case FETCH_KRB_BTC:
            return { ...state, krbBTC: action.payload.data};
    }

    return state;
}
