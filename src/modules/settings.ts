export const CHANGE_SETTING = 'settings/CHANGESETTING'

const configuration = require('../configuration.json').settings;
const initialState = {
    settings: configuration,
    settingOverrides: {}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_SETTING:
            return {
                ...state,
                settingOverrides: Object.assign({}, state.settingOverrides, { [action.settingKey]: action.settingValue })
            }

        default:
            return state
    }
}

export const changeSetting = (settingKey, settingValue) => {
    return dispatch => {
        dispatch({
            type: CHANGE_SETTING,
            settingKey,
            settingValue
        })
    }
}
