import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import counter from './counter'
import settings from './settings'

export default combineReducers({
    routing: routerReducer,
    counter,
    settings
})