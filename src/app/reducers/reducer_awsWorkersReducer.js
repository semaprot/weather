import { AWS_WORKERS } from '../actions/awsWorkers'

export default function (state = {}, action) {
    switch (action.type) {
        case AWS_WORKERS:
            return { ...state, awsWorkers: action.payload};
    }

    return state;
}
