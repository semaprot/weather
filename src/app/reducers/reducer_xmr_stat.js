import { FETCH_XMR_STAT } from '../actions/getXmrStat'

export default function (state = {}, action) {
    // console.log('action.payload.data', action.payload.data)
    switch (action.type) {
        case FETCH_XMR_STAT:
            return { ...state, xmrStat: action.payload.data};
    }

    return state;
}