import { FETCH_USD_BTC } from '../actions/getUsdBtc'

export default function (state = {}, action) {
    switch (action.type) {
        case FETCH_USD_BTC:
            return { ...state, usdBTC: action.payload.data};
    }

    return state;
}
