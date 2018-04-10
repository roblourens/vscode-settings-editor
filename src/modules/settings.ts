export const CHANGE_SETTING = 'settings/CHANGESETTING'
export const CHANGE_DISPLAY_PROP = 'settings/CHANGE_DISPLAY_PROP'

export interface DisplayProps {
    showAdvancedSettings: false,
    showOverriddenSettingsOnly: false
}

const configuration = require('../configuration_full.json').settings;
const initialState = {
    settings: configuration,
    settingOverrides: {},
    displayProps: <DisplayProps>{
        showAdvancedSettings: false,
        showOverriddenSettingsOnly: false
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_SETTING:
            return {
                ...state,
                settingOverrides: Object.assign({}, state.settingOverrides, { [action.settingKey]: action.settingValue })
            }
        case CHANGE_DISPLAY_PROP:
            return {
                ...state,
                displayProps: {
                    ...state.displayProps,
                    [action.propId]: action.value
                }
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

export const changeDisplayProp = (propId: string, value: boolean) => {
    return dispatch => {
        dispatch({
            type: CHANGE_DISPLAY_PROP,
            propId,
            value
        })
    }
}