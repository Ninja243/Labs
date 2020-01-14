import { combineReducers } from 'redux';

// Login funcs

// Random string generator for nonce
function randomString(length) {
    var result = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return result;
}
// Auth0 constants
const auth0ClientId = 'KLciWpxigi9TW81egFgImpCx5bEFTNgq';
const auth0Domain = 'https://mweya-labs.eu.auth0.com';
// Converts an object to a query string.
function toQueryString(params) {
    return '?' + Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

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