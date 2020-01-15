import { combineReducers } from 'redux';

// REDUX

export const authIn = profile => (
    {
        type: 'LOG_IN',
        payload: profile
    }
);

export const authOut = profile => (
    {
        type: 'LOG_OUT',
        payload: profile
    }
);

const authReducer = (state = INITIAL_STATE, action) => {
    const {
        current, possible
    } = state;
    switch (action.type) {
        case 'LOG_IN':
            current.push(possible.splice(action.payload, 1));
            const newState = { current, possible };
            return newState;
        case 'LOG_OUT':

        default:
            return state;
    }
};



export default combineReducers({

    auth: authReducer
});

//friends: friendReducer,







/*const friendReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ADD_FRIEND':
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time
            const {
                current,
                possible,
            } = state;

            // Pull friend out of friends.possible
            // Note that action.payload === friendIndex
            const addedFriend = possible.splice(action.payload, 1);

            // And put friend in friends.current
            current.push(addedFriend);

            // Finally, update our redux state
            const newState = { current, possible };
            return newState;
        default:
            return state;
    }
};*/