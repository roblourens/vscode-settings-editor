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
    'listItem': {
        backgroundColor: 'white'
    },
    'listItem:hover': {
        backgroundColor: 'initial !important'
    },
    listItemText: {
        maxWidth: 600
    },
    settingValueEditor: {
        marginRight: 10
    },

    textFieldInput: {
        textAlign: 'right'
    },
    numberFieldInput: {
        textAlign: 'right',
        width: 50
    }
});

function SettingItem(props: ItemProps) {
    const { classes, setting } = props;
    const name = setting.name.replace(/^Commonly Used\./, '');

    return (
        <ListItem button={true} className={classes.listItem} >
            <ListItemText primary={`"${name}"`} secondary={setting.description} className={classes.listItemText} />
            <ListItemSecondaryAction className={classes.settingValueEditor}>{renderSettingValue(setting, classes)}</ListItemSecondaryAction>
        </ListItem>
    );
}

export default withStyles(styles as any)(SettingItem);

interface ValueProps {
    setting: Setting;
    classes: any;
}

interface ValueState {
    value: any;
}

class SettingValue extends React.Component<ValueProps, ValueState> {
    protected handleChange() {
        return event => {
            this.setState({ 'value': event.target.value });
        };
    }

    protected getHelperText() {
        if (!this.state) {
            return '';
        }

        const { setting } = this.props;
        return (!this.state || setting.default + '' === this.state.value) ?
            '' :
            'Modified';
    }
}

class BoolSettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        return (
            <Checkbox defaultChecked={setting.default} onChange={this.handleChange()} />
        );
    }
}

class StringSettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        const inputProps = { className: classes.textFieldInput };
        return (
            <TextField defaultValue={setting.default} inputProps={inputProps} onChange={this.handleChange()} helperText={this.getHelperText()} />
        );
    }
}

class NumberSettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        const inputProps = { className: classes.numberFieldInput };
        return (
            <TextField defaultValue={String(setting.default)} inputProps={inputProps} onChange={this.handleChange()} helperText={this.getHelperText()} />
        );
    }
}

class ObjectSettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        return (
            <TextField disabled={true} value="Edit in settings.json!" onChange={this.handleChange()} />
        );
    }
}

class EnumSettingValue extends SettingValue {
    render() {
        const { setting, classes } = this.props;
        return (
            <TextField select={true} value={this.state && this.state.value || setting.default} onChange={this.handleChange()} helperText={this.getHelperText()} >
                {setting.enum!.map(enumStr => <MenuItem key={enumStr} value={enumStr}>{enumStr}</MenuItem>)}
            </TextField>
        );
    }
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
