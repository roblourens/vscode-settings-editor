import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import settings from './settings'

export default combineReducers({
    routing: routerReducer,
    settings
})