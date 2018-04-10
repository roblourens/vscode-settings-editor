import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';

import { changeSetting, DisplayProps, Setting } from './../modules/settings'
import { SettingList } from './SettingList';
import EditorControls from './EditorControls';

export enum SettingType {
    string,
    number,
    integer,
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
                <EditorControls
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

function words(str: string) {
    return str.toLowerCase()
        .split(' ');
}

function match(str: string, queryWords: string[]) {
    str = str.toLowerCase();
    return queryWords.every(w => str.indexOf(w) >= 0);
}
