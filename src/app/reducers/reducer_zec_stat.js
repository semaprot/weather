import { FETCH_ZEC_STAT } from '../actions/getZecStat'

export default function (state = {}, action) {
    // console.log('action.payload.data', action.payload.data)
    switch (action.type) {
        case FETCH_ZEC_STAT:
            return { ...state, zecStat: action.payload.data};
    }

    return state;
}
