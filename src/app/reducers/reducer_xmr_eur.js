import { FETCH_XMR_EUR } from '../actions/getXmrEUR'

export default function (state = {}, action) {
    switch (action.type) {
        case FETCH_XMR_EUR:
            return { ...state, xmrEUR: action.payload.data};
    }

    return state;
}
