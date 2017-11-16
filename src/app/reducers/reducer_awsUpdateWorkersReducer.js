import { UPDATE_AWS_WORKERS } from '../actions/updateWorkers'

export default function (state = {}, action) {
    switch (action.type) {
        case UPDATE_AWS_WORKERS:
            return { ...state, awsWorkers: action.payload};
    }

    return state;
}
