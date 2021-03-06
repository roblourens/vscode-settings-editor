import * as React from 'react';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import { withStyles, WithStyles } from 'material-ui/styles';

import { SettingType, SettingsGroup } from './Editor';
import { Setting, SettingsScope } from '../modules/settings';
import { Typography, IconButton, Icon } from 'material-ui';

export interface ItemProps {
    group: SettingsGroup;
    setting: Setting;
    value: any;
    isConfigured: boolean;
    otherConfiguredScopes: SettingsScope[];
    onChange: (value: any) => void;
    classes?: any;
}

const SettingItem = class extends React.PureComponent<ItemProps & WithStyles<'root'>> {
    render() {
        const { classes, setting } = this.props;
        const name = getSettingName(setting);

        return (
            <div>
                <ListItem button={true} className={classes.listItem} >
                    <ListItemText title={getActualSettingName(setting)} primary={name} secondary={setting.description} className={classes.listItemText} />
                    <ListItemSecondaryAction className={classes.settingValueEditor}>
                        {renderSettingValue(this.props)}
                    </ListItemSecondaryAction>
                    {this.renderRevertButton()}

                </ListItem>
                {this.renderOtherScopes()}
            </div>
        );
    }

    private renderOtherScopes() {
        const otherScopeNames = this.props.otherConfiguredScopes.map(s => s.toString()).join(', ');
        return this.props.otherConfiguredScopes && this.props.otherConfiguredScopes.length ?
            (<Typography className={this.props.classes.alsoConfiguredHint}>- Also configured in: {otherScopeNames}</Typography>) :
            null;
    }

    private renderRevertButton() {
        return this.props.isConfigured ? (
            <IconButton className={this.props.classes.revertButton} onClick={() => this.props.onChange(undefined)} title="Revert">
                <Icon>undo</Icon>
            </IconButton>) :
            null;
    }
};

export default SettingItem as any;

interface ValueProps {
    setting: Setting;
    classes: any;
    value: any;
    isOverridden: boolean;
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
        return this.props.isOverridden ? 'Overridden in another scope' :
            (setting.default !== this.props.value) ? 'Configured' :
            '';
    }

    protected getClassName(): string {
        return this.props.isOverridden ? this.props.classes.overridden : '';
    }
}

class BoolSettingValue extends SettingValue {
    protected handleChange() {
        return (event, checked) => {
            this.props.onChange(checked);
        };
    }

    protected getClassName(): string {
        const className = this.props.setting.default !== this.props.value ? this.props.classes.modifiedBool : '';
        return className + super.getClassName();
    }

    render() {
        const { setting, classes, value } = this.props;
        return (
            <Checkbox
                className={this.getClassName()}
                defaultChecked={setting.default}
                onChange={this.handleChange()}
            />
        );
    }
}

class StringSettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        const inputProps = { className: classes.textFieldInput + ' ' + this.getClassName() };
        return (
            <TextField
                className={this.getClassName()}
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
        const inputProps = { className: classes.numberFieldInput + ' ' + this.getClassName() };
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
                inputProps={({ className: classes.objectValue + ' ' + this.getClassName() })}
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
                inputProps={({ className: classes.arrayValue + ' ' + this.getClassName() })}
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
                inputProps={{ className: this.getClassName() }}
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
    const isOverridden = false;

    return (
        setting.type === SettingType[SettingType.boolean] ? <BoolSettingValue value={value} onChange={onChange} setting={setting} classes={classes} isOverridden={isOverridden} /> :
        setting.type === SettingType[SettingType.string] && setting.enum ? <EnumSettingValue value={value} onChange={onChange} setting={setting} classes={classes} isOverridden={isOverridden} /> :
        setting.type === SettingType[SettingType.string] ? <StringSettingValue value={value} onChange={onChange} setting={setting} classes={classes} isOverridden={isOverridden} /> :
        setting.type === SettingType[SettingType.number] ? <NumberSettingValue value={value} onChange={onChange} setting={setting} classes={classes} isOverridden={isOverridden} /> :
        setting.type === SettingType[SettingType.integer] ? <NumberSettingValue value={value} onChange={onChange} setting={setting} classes={classes} isOverridden={isOverridden} /> :
        setting.type === SettingType[SettingType.object] ? <ObjectSettingValue value={value} onChange={onChange} setting={setting} classes={classes} isOverridden={isOverridden} /> :
        setting.type === SettingType[SettingType.array] ? <ArraySettingValue value={value} onChange={onChange} setting={setting} classes={classes} isOverridden={isOverridden} /> :
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