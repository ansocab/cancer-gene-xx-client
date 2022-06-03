export const serverUrl =
    process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_PROD_SERVER
        : process.env.REACT_APP_DEV_SERVER;