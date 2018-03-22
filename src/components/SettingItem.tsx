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
        <input type="checkbox" checked={props.setting.default} />
    );
}

function StringSettingValue(props: ValueProps) {
    return (
        <input value={props.setting.default} />
    );
}

function NumberSettingValue(props: ValueProps) {
    return (
        <input value={props.setting.default} />
    );
}

function ObjectSettingValue(props: ValueProps) {
    return (
        <input />
    );
}

function EnumSettingValue(props: ValueProps) {
    return (
        <select>
            {props.setting.enum!.map(enumStr => <option key={enumStr}>{enumStr}</option>)}
        </select>
    );
}

function renderSettingValue(setting: Setting) {
    return (
        setting.type === SettingType[SettingType.boolean] ? <BoolSettingValue setting={setting} /> :
        setting.type === SettingType[SettingType.string] && setting.enum ? <EnumSettingValue setting={setting} /> :
        setting.type === SettingType[SettingType.string] ? <StringSettingValue setting={setting} /> :
        setting.type === SettingType[SettingType.number] ? <NumberSettingValue setting={setting} /> :
        setting.type === SettingType[SettingType.object] ? <ObjectSettingValue setting={setting} /> :
        null
    );
}
