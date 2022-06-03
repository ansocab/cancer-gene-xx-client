import {
    getUserRequest, getUserSuccess, getUserFailure,
    createUserRequest, createUserSuccess, createUserFailure,
    loginRequest, loginSuccess, loginFailure,
    logoutRequest, logoutSuccess, logoutFailure,
    resetRedirectUrl
} from './actions';

const serverUrl =
    process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_PROD_SERVER
        : process.env.REACT_APP_DEV_SERVER;

const options = {
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
    "Access-Control-Allow-Origin": serverUrl,
}

export const loadUser = () => async dispatch => {
    dispatch(getUserRequest());
    
    fetch(`${serverUrl}/profile`, options)
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            console.log("logged in, continuing session as " + res.user.name);
            dispatch(getUserSuccess(res.user));
        } else {
            console.log("not logged in, continuing session anonymously");
            //TODO: dispatch display alert
            dispatch(getUserFailure());
        }
    })
    .catch((err) => {
        console.log(err)
        //TODO: dispatch display alert
        dispatch(getUserFailure());
    });
}

export const register = (data) => async dispatch => {
    dispatch(createUserRequest());

    fetch(`${serverUrl}/register`, {
        ...options,
        method: "POST",
        body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success === true) {
          dispatch(createUserSuccess(res.user));
          //TODO: callback("registered");
        } else {
          console.log(res);
          //TODO: dispatch display alert
          dispatch(createUserFailure());
        }
      })
      .catch((err) => {
          console.log(err)
          //TODO: dispatch display alert
          dispatch(createUserFailure());
      });
};

export const login = (data) => async dispatch => {
    dispatch(loginRequest());

    fetch(`${serverUrl}/login`, {
        ...options,
        method: "POST",
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success === true) {
            dispatch(loginSuccess(res.user));
            //TODO: callback("loggedIn");
        } else {
          console.log(res);
          //TODO: dispatch display alert
          dispatch(loginFailure());
        }
      })
      .catch((err) => {
        console.log(err)
        //TODO: dispatch display alert
        dispatch(loginFailure());
    });
};

export const logout = () => async dispatch =>  {
    dispatch(logoutRequest());

    fetch(`${serverUrl}/logout`, options)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success === true) {
          dispatch(logoutSuccess(res.redirectUrl));
        } else {
          console.log(res);
          //TODO: dispatch display alert
          dispatch(logoutFailure());
        }
      })
      .catch((err) => {
            console.log(err)
            //TODO: dispatch display alert
            dispatch(logoutFailure());
        });
};

export const resetRedirect = () => async dispatch => {
    dispatch(resetRedirectUrl());
}