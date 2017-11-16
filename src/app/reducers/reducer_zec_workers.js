import { FETCH_ZEC_WORKERS } from '../actions/getZecWorkers'

export default function (state = {}, action) {
    // console.log('action.payload.data', action.payload.data)
    switch (action.type) {
        case FETCH_ZEC_WORKERS:
            return { ...state, zecWorkers: action.payload.data};
    }

    return state;
}
