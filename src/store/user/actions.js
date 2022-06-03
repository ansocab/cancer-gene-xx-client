import { 
    GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE, 
    CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE,
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, 
    LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
    RESET_REDIRECT_URL
} from './constants';

export const getUserRequest = () => ({
    type: GET_USER_REQUEST
});

export const getUserSuccess = user => ({
    type: GET_USER_SUCCESS,
    payload: user
});

export const getUserFailure = () => ({
    type: GET_USER_FAILURE
});

export const createUserRequest = user => ({
    type: CREATE_USER_REQUEST,
    payload: user
});

export const createUserSuccess = user => ({
    type: CREATE_USER_SUCCESS,
    payload: user
});

export const createUserFailure = () => ({
    type: CREATE_USER_FAILURE
});

export const loginRequest = user => ({
    type: LOGIN_REQUEST,
    payload: user
});

export const loginSuccess = user => ({
    type: LOGIN_SUCCESS,
    payload: user
});

export const loginFailure = () => ({
    type: LOGIN_FAILURE
});

export const logoutRequest = () => ({
    type: LOGOUT_REQUEST
});

export const logoutSuccess = (redirectUrl) => ({
    type: LOGOUT_SUCCESS,
    payload: redirectUrl
});

export const logoutFailure = () => ({
    type: LOGOUT_FAILURE
});

export const resetRedirectUrl = () => ({
    type: RESET_REDIRECT_URL
});