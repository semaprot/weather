import { FETCH_UAH_BTC } from '../actions/getUahBtc'

export default function (state = {}, action) {
    switch (action.type) {
        case FETCH_UAH_BTC:
            return { ...state, uahBTC: action.payload.data};
    }

    return state;
}
