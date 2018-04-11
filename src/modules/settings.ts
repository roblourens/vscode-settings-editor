export const CHANGE_SETTING = 'settings/CHANGE_SETTING'
export const CHANGE_DISPLAY_PROP = 'settings/CHANGE_DISPLAY_PROP'
export const CHANGE_CURRENT_SCOPE = 'settings/CHANGE_CURRENT_SCOPE'

export interface DisplayProps {
    showAdvancedSettings: false,
    showOverriddenSettingsOnly: false
}

export interface Setting {
    name: string;
    description: string;
    type: string;
    default?: any; // any
    enum?: string[];
    enumDescriptions?: string[];
}

export enum SettingsScope {
    User = 'User',
    Workspace = 'Workspace',
    FolderA = 'Folder A',
    FolderB = 'Folder B'
}

const configuration = require('../configuration_full.json').settings;
const initialState = {
    settings: configuration as Setting[],
    settingOverrides: {
        [SettingsScope.Workspace]: {},
        [SettingsScope.User]: {},
        [SettingsScope.FolderA]: {},
        [SettingsScope.FolderB]: {},
    },
    currentScope: SettingsScope.User,
    displayProps: <DisplayProps> {
        showAdvancedSettings: false,
        showOverriddenSettingsOnly: false
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_SETTING:
            const newCurrentScopeOverrides = {
                ...state.settingOverrides[state.currentScope],
                [action.settingKey]: action.settingValue
            };

            return {
                ...state,
                settingOverrides: {
                    ...state.settingOverrides,
                    [state.currentScope]: newCurrentScopeOverrides
                }
            }
        case CHANGE_DISPLAY_PROP:
            return {
                ...state,
                displayProps: {
                    ...state.displayProps,
                    [action.propId]: action.value
                }
            }
        case CHANGE_CURRENT_SCOPE:
            return {
                ...state,
                currentScope: action.scope
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

export const changeCurrentScope = (scope: SettingsScope) => {
    return dispatch => {
        dispatch({
            type: CHANGE_CURRENT_SCOPE,
            scope
        })
    }
}
