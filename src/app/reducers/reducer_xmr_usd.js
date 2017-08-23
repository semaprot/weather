import { FETCH_XMR_USD } from '../actions/getXmrUSD'

export default function (state = {}, action) {
    switch (action.type) {
        case FETCH_XMR_USD:
            return { ...state, xmrUSD: action.payload.data};
    }

    return state;
}
