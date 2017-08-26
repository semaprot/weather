import { FETCH_EUR_BTC } from '../actions/getEurBtc'

export default function (state = {}, action) {
    switch (action.type) {
        case FETCH_EUR_BTC:
            return { ...state, eurBTC: action.payload.data};
    }

    return state;
}
