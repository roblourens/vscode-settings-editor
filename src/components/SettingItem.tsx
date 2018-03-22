import * as React from 'react';
import { Setting, SettingType } from './Editor';
import './SettingItem.css';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

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
        <Checkbox defaultChecked={props.setting.default} />
    );
}

function StringSettingValue(props: ValueProps) {
    return (
        <TextField defaultValue={props.setting.default} />
    );
}

function NumberSettingValue(props: ValueProps) {
    return (
        <TextField defaultValue={props.setting.default} />
    );
}

function ObjectSettingValue(props: ValueProps) {
    return (
        <TextField disabled={true} />
    );
}

function EnumSettingValue(props: ValueProps) {
    return (
        <Select value={props.setting.default}>
            {props.setting.enum!.map(enumStr => <MenuItem key={enumStr} value={enumStr}>{enumStr}</MenuItem>)}
        </Select>
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
