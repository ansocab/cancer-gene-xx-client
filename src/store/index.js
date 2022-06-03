import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { user } from './user/reducer';

const reducers = {
    user
};

const rootReducer = combineReducers(reducers);

export const configureStore = () => 
    createStore(
        rootReducer,
        composeWithDevTools(
            applyMiddleware(thunk)
        ) 
    );