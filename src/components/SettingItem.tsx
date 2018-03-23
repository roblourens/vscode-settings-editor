import * as React from 'react';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';

import { Setting, SettingType, SettingsGroup } from './Editor';

export interface ItemProps {
    group: SettingsGroup;
    setting: Setting;
    classes?: any;
}

const styles = (theme: any) => ({
    listItemText: {
        maxWidth: 600
    }
});

function SettingItem(props: ItemProps) {
    const { classes, setting } = props;
    const name = setting.name.replace(/^Commonly Used\./, '');

    return (
        <ListItem button={true} >
            <ListItemText primary={name} secondary={setting.description} className={classes.listItemText} />
            <ListItemSecondaryAction className={classes.settingValueEditor}>{renderSettingValue(setting, classes)}</ListItemSecondaryAction>
        </ListItem>
    );
}

export default withStyles(styles as any)(SettingItem);

interface ValueProps {
    setting: Setting;
    classes: any;
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
        <TextField defaultValue={String(props.setting.default)} />
    );
}

function ObjectSettingValue(props: ValueProps) {
    return (
        <TextField disabled={true} value="Edit in settings.json!" />
    );
}

function EnumSettingValue(props: ValueProps) {
    return (
        <Select value={props.setting.default}>
            {props.setting.enum!.map(enumStr => <MenuItem key={enumStr} value={enumStr}>{enumStr}</MenuItem>)}
        </Select>
    );
}

function renderSettingValue(setting: Setting, classes: any) {
    return (
        setting.type === SettingType[SettingType.boolean] ? <BoolSettingValue setting={setting} classes={classes} /> :
        setting.type === SettingType[SettingType.string] && setting.enum ? <EnumSettingValue setting={setting} classes={classes} /> :
        setting.type === SettingType[SettingType.string] ? <StringSettingValue setting={setting} classes={classes} /> :
        setting.type === SettingType[SettingType.number] ? <NumberSettingValue setting={setting} classes={classes} /> :
        setting.type === SettingType[SettingType.object] ? <ObjectSettingValue setting={setting} classes={classes} /> :
        null
    );
}
