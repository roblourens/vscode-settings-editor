import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField, Checkbox, FormControlLabel } from 'material-ui';

import { changeSetting, DisplayProps, changeDisplayProp, Setting } from './../modules/settings'
import { SettingList } from './SettingList';

export enum SettingType {
    string,
    number,
    boolean,
    object,
    array
}

export interface SettingsGroup {
    name: string;
    settings: Setting[];
}

export interface EditorProps {
    settings: Setting[];
    settingOverrides: any;
    classes?: any;
    onChangeSetting?: typeof changeSetting;

    displayProps?: DisplayProps;
}

export interface SearchableSettingsState {
    // filteredSettings: Setting[];
    query: string;
}

const decorate = withStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 800,
        margin: '70px auto 0',
        backgroundColor: theme.palette.background.default,
        position: 'relative' as 'relative', // I hate TS
        overflow: 'auto' as 'auto',
        padding: '5px'
    },
    searchInput: {
        marginBottom: '20px'
    },
    listSection: {
        marginBottom: 40
    },
    listSubheader: {
        backgroundColor: 'white'
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
        boxShadow: '0px 0px 8px grey'
    },

    // Moved these out to the top level for perf reasons. Not sure what the proper usage is.
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
    },

    editorControlsContainer: {
        height: 40
    },
    editorControl: {
        float: 'right'
    }
}));

const SearchableSettings = decorate(class extends React.PureComponent<EditorProps & WithStyles<'root'>, SearchableSettingsState> {
    componentWillMount() {
        if (!this.state) {
            this.setState({
                query: ''
            });
        }
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <EditorControlsConnected
                    classes={this.props.classes}
                />
                <TextField
                    className={this.props.classes.searchInput}
                    label="Search"
                    onChange={this.handleChange()}
                    fullWidth={true}
                />
                <SettingList
                    settings={this.getFilteredSettings()}
                    classes={this.props.classes}
                    settingOverrides={this.props.settingOverrides}
                    onChangeSetting={this.props.onChangeSetting}
                />
            </div>
        );
    }

    private handleChange() {
        return event => {
            this.setState({
                query: event.target.value
            });
        };
    }

    private getFilteredSettings(): Setting[] {
        let filteredSettings = this.props.settings;

        if (!this.props.displayProps!.showAdvancedSettings && !this.state.query) {
            filteredSettings = filteredSettings.filter(s => !!s.name.match(/^Commonly Used/));
        }

        if (this.props.displayProps!.showOverriddenSettingsOnly) {
            filteredSettings = filteredSettings.filter(s => !!this.props.settingOverrides[s.name]);
        }

        if (this.state.query) {
            const queryWords = words(this.state.query);

            filteredSettings = this.props.settings.filter(s => {
                return match(s.name, queryWords) || match(s.description, queryWords);
            });
        }

        return filteredSettings;
    }
});

const mapStateToProps = state => ({
    settings: state.settings.settings,
    settingOverrides: state.settings.settingOverrides,
    displayProps: state.settings.displayProps
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onChangeSetting: changeSetting
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchableSettings as any);

interface ControlsProps {
    displayProps: DisplayProps;
    classes: any;

    onChangeDisplayProp: (propId: string, value: boolean) => void;
}

class EditorControls extends React.PureComponent<ControlsProps> {
    render() {
        return (
            <div className={this.props.classes.editorControlsContainer}>
                <FormControlLabel
                    className={this.props.classes.editorControl}
                    control={
                        <Checkbox
                            defaultChecked={this.props.displayProps.showOverriddenSettingsOnly}
                            onChange={this.getCheckboxChangeHandler('showOverriddenSettingsOnly')}
                        />
                    }
                    label="Show overridden settings only"
                />
                <FormControlLabel
                    className={this.props.classes.editorControl}
                    control={
                        <Checkbox
                            defaultChecked={this.props.displayProps.showAdvancedSettings}
                            onChange={this.getCheckboxChangeHandler('showAdvancedSettings')}
                        />
                    }
                    label="Show advanced settings"
                />
            </div>
        )
    }

    private getCheckboxChangeHandler(displayPropName: string) {
        return (e, checked) => {
            this.props.onChangeDisplayProp(displayPropName, checked);
        }
    }
}

const mapStateToPropsEC = state => ({
    displayProps: state.settings.displayProps,
});

const mapDispatchToPropsEC = dispatch => bindActionCreators({
    onChangeDisplayProp: changeDisplayProp
}, dispatch);

const EditorControlsConnected: any = connect(
    mapStateToPropsEC,
    mapDispatchToPropsEC
)(EditorControls as any);

function words(str: string) {
    return str.toLowerCase()
        .split(' ');
}

function match(str: string, queryWords: string[]) {
    str = str.toLowerCase();
    return queryWords.every(w => str.indexOf(w) >= 0);
}
