import {SET_CURRENT_USER} from '../actions/types';
import isEmpty from 'lodash/isEmpty';

const initialState = {
    isAuthenticated: false,
    isInitiated: false,
    user: {}
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                isAuthenticated: !isEmpty(action.user),
                isInitiated: action.user.initiated,
                user: action.user
            };
        default:
            return state;
    }
}
