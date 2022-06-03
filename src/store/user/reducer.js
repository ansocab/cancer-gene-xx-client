import { 
    GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE, 
    CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE,
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, 
    LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
    RESET_REDIRECT_URL
} from './constants';

const initialState = {
    data: null,
    redirectUrl: '',
    isLoading: false
};

export const user = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_USER_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }

        case GET_USER_SUCCESS: {
            return {
                ...state,
                data: payload,
                isLoading: false
            }
        }

        case GET_USER_FAILURE: {
            return {
                ...state,
                isLoading: false
            }
        }

        case CREATE_USER_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }

        case CREATE_USER_SUCCESS: {
            return {
                ...state,
                data: payload,
                redirectUrl: "savedsearches",
                isLoading: false
            }
        }

        case CREATE_USER_FAILURE: {
            return {
                ...state,
                isLoading: false
            }
        }

        case LOGIN_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }

        case LOGIN_SUCCESS: {
            return {
                ...state,
                data: payload,
                redirectUrl: "savedsearches",
                isLoading: false
            }
        }

        case LOGIN_FAILURE: {
            return {
                ...state,
                isLoading: false
            }
        }

        case LOGOUT_REQUEST: {
            return {
                ...state,
                isLoading: true
            }
        }

        case LOGOUT_SUCCESS: {
            return {
                ...state,
                data: null,
                redirectUrl: payload,
                isLoading: false
            }
        }

        case LOGOUT_FAILURE: {
            return {
                ...state,
                isLoading: false
            }
        }

        case RESET_REDIRECT_URL: {
            return {
                ...state,
                redirectUrl: ''
            }
        }

        default:
            return state;
    }
}
