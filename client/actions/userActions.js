import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import {SET_CURRENT_USER} from './types';

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    };
}


export function logout() {
    return dispatch => {
        localStorage.removeItem('jwtToken');
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
    }
}

export function login(data) {
    const bodyFormData = new FormData();
    bodyFormData.append('email', data.email);
    bodyFormData.append('password', data.password);
    return dispatch => {
        return axios.post('/api/users/auth', bodyFormData).then(res => {
            const token = res.data;
            localStorage.setItem('jwtToken', token);
            setAuthorizationToken(token);
            dispatch(setCurrentUser(jwtDecode(token)));
        }).catch((err) => {
                if (err.response) {
                    console.log(err.response.data);
                    return new Error(err.response.data);
                }
            }
        );
    }
}

export function initiate(data) {
    const bodyFormData = new FormData();
    bodyFormData.append('tp_1', data.tp_1);
    bodyFormData.append('tp_2', data.tp_2);
    bodyFormData.append('tp_3', data.tp_3);
    return dispatch => {
        return axios.post('/api/users/initiate', bodyFormData).then(res => {
            const token = res.data;
            localStorage.setItem('jwtToken', token);
            dispatch(setCurrentUser(jwtDecode(token)));
            return res.data;
        });
    }
}


export function userSignupRequest(userData) {
    const bodyFormData = new FormData();
    bodyFormData.append('name', userData.name);
    bodyFormData.append('email', userData.email);
    bodyFormData.append('password', userData.password);
    return dispatch => {
        return axios.post('/api/users/new/', bodyFormData).then(res => {
            const token = res.headers['x-auth-token'];
            localStorage.setItem('jwtToken', token);
            setAuthorizationToken(token);
            dispatch(setCurrentUser(jwtDecode(token)));
        }).catch((err) => {
                if (err.response) {
                    console.log(err.response.data);
                    return new Error(err.response.data);
                }
            }
        );
    }
}

export function isUserExists(identifier) {
    return () => {
        return axios.get(`/api/users/check/${identifier}`);
    }
}
