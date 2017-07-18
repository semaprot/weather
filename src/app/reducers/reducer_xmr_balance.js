import { FETCH_XMR_BALANCE } from '../actions/getXmrBalance'

export default function (state = {}, action) {
    switch (action.type) {
        case FETCH_XMR_BALANCE:
            return { ...state, xmrBalance: action.payload.data};
    }

    return state;
}