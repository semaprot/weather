import { FETCH_ZEC_PRICES } from '../actions/getZecPrices'

export default function (state = {}, action) {
    // console.log('action.payload.data', action.payload.data)
    switch (action.type) {
        case FETCH_ZEC_PRICES:
            return { ...state, zecPrices: action.payload.data};
    }

    return state;
}
