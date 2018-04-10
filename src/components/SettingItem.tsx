import * as React from 'react';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import { withStyles, WithStyles } from 'material-ui/styles';

import { SettingType, SettingsGroup } from './Editor';
import { Setting } from '../modules/settings';

export interface ItemProps {
    group: SettingsGroup;
    setting: Setting;
    value: any;
    onChange: (value: any) => void;
    classes?: any;
}

const SettingItem = class extends React.PureComponent<ItemProps & WithStyles<'root'>> {
    render() {
        const { classes, setting } = this.props;
        const name = getSettingName(setting);

        return (
            <ListItem button={true} className={classes.listItem} >
                <ListItemText title={getActualSettingName(setting)} primary={name} secondary={setting.description} className={classes.listItemText} />
                <ListItemSecondaryAction className={classes.settingValueEditor}>{renderSettingValue(this.props)}</ListItemSecondaryAction>
            </ListItem>
        );
    }
};

export default SettingItem as any;

interface ValueProps {
    setting: Setting;
    classes: any;
    value: any;
    onChange: (value: any) => void;
}

class SettingValue extends React.PureComponent<ValueProps> {
    protected handleChange() {
        return (event, arg?) => {
            this.props.onChange(event.target.value);
        };
    }

    protected getHelperText() {
        const { setting } = this.props;
        return (setting.default === this.props.value) ?
            '' :
            'Modified';
    }
}

class BoolSettingValue extends SettingValue {
    protected handleChange() {
        return (event, checked) => {
            this.props.onChange(checked);
        };
    }

    render() {
        const { setting, classes, value } = this.props;
        return (
            <Checkbox
                className={setting.default !== value ? classes.modifiedBool : ''}
                defaultChecked={setting.default}
                onChange={this.handleChange()}
            />
        );
    }
}

class StringSettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        const inputProps = { className: classes.textFieldInput };
        return (
            <TextField
                error={this.props.value !== setting.default}
                defaultValue={setting.default}
                inputProps={inputProps}
                onChange={this.handleChange()}
                helperText={this.getHelperText()}
            />
        );
    }
}

class NumberSettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        const inputProps = { className: classes.numberFieldInput };
        return (
            <TextField
                type="number"
                error={this.props.value !== setting.default}
                defaultValue={String(setting.default)}
                inputProps={inputProps}
                onChange={this.handleChange()}
                helperText={this.getHelperText()}
            />
        );
    }
}

class ObjectSettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        return (
            <TextField
                inputProps={({ className: classes.objectValue })}
                disabled={true}
                value="Edit in settings.json!"
                onChange={this.handleChange()}
            />
        );
    }
}

class ArraySettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        return (
            <TextField
                inputProps={({ className: classes.arrayValue })}
                disabled={true}
                value="Edit in settings.json!"
                onChange={this.handleChange()}
            />
        );
    }
}

class EnumSettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        return (
            <TextField
                error={this.props.value !== setting.default}
                select={true}
                value={this.props.value}
                onChange={this.handleChange()}
                helperText={this.getHelperText()}
            >
                {setting.enum!.map(enumStr => <MenuItem key={enumStr} value={enumStr}>{enumStr}</MenuItem>)}
            </TextField>
        );
    }
}

function renderSettingValue(itemProps: ItemProps) {
    const { setting, value, onChange, classes } = itemProps;
    return (
        setting.type === SettingType[SettingType.boolean] ? <BoolSettingValue value={value} onChange={onChange} setting={setting} classes={classes} /> :
        setting.type === SettingType[SettingType.string] && setting.enum ? <EnumSettingValue value={value} onChange={onChange} setting={setting} classes={classes} /> :
        setting.type === SettingType[SettingType.string] ? <StringSettingValue value={value} onChange={onChange} setting={setting} classes={classes} /> :
        setting.type === SettingType[SettingType.number] ? <NumberSettingValue value={value} onChange={onChange} setting={setting} classes={classes} /> :
        setting.type === SettingType[SettingType.integer] ? <NumberSettingValue value={value} onChange={onChange} setting={setting} classes={classes} /> :
        setting.type === SettingType[SettingType.object] ? <ObjectSettingValue value={value} onChange={onChange} setting={setting} classes={classes} /> :
        setting.type === SettingType[SettingType.array] ? <ArraySettingValue value={value} onChange={onChange} setting={setting} classes={classes} /> :
        null
    );
}

function getSettingName(s: Setting): string {
    let name = getActualSettingName(s);

    const lastDotIdx = name.lastIndexOf('.');
    if (lastDotIdx >= 0) {
        name = name.substr(0, lastDotIdx) + ': ' + name.substr(lastDotIdx + 1);
    }

    return name
        .replace(/\.([a-z])/, (match, p1) => `.${p1.toUpperCase()}`)
        .replace(/([a-z])([A-Z])/g, '$1 $2') // fooBar => foo Bar
        .replace(/^[a-z]/g, match => match.toUpperCase()) // foo => Foo
        .replace(/ [a-z]/g, match => match.toUpperCase()) // Foo bar => Foo Bar
}

 // This is a lazy hack
function getActualSettingName(s: Setting): string {
    return s.name
        .replace(/^Commonly Used\./, '');
}