import { combineReducers } from 'redux';

const INITIAL_STATE = {
    profile: {
        name: null,
        given_name: null,
        family_name: null,
        nickname: null,
        email: null,
    }
};

const profileReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        default:
            return state
    }
};

export default combineReducers({
    profile: profileReducer,
});