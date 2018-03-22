import * as React from 'react';
import { Setting, SettingType } from './Editor';
import './SettingItem.css';

export interface ItemProps {
    setting: Setting;
}

export function SettingItem(props: ItemProps) {
    return (
        <div className="settingItem">
            <div className="settingLabel">{props.setting.name}</div>
            <div className="settingDescription">{props.setting.description}</div>
            <div className="settingValueEditor">{renderSettingValue(props.setting)}</div>
        </div>
    );
}

interface ValueProps {
    setting: Setting;
}

function BoolSettingValue(props: ValueProps) {
    return (
        <input type="checkbox" />
    );
}

function StringSettingValue(props: ValueProps) {
    return (
        <input />
    );
}

function NumberSettingValue(props: ValueProps) {
    return (
        <input />
    );
}

function ObjectSettingValue(props: ValueProps) {
    return (
        <input />
    );
}

function renderSettingValue(setting: Setting) {
    return (
        setting.type === SettingType[SettingType.boolean] ? <BoolSettingValue setting={setting} /> :
        setting.type === SettingType[SettingType.string] ? <StringSettingValue setting={setting} /> :
        setting.type === SettingType[SettingType.number] ? <NumberSettingValue setting={setting} /> :
        setting.type === SettingType[SettingType.object] ? <ObjectSettingValue setting={setting} /> :
        null
    );
}
