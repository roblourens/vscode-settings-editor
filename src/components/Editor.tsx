import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';

import { changeSetting } from './../modules/settings'
import { SettingList } from './SettingList';

export enum SettingType {
    string,
    number,
    boolean,
    object
}

export interface Setting {
    name: string;
    description: string;
    type: string;
    default?: any; // any
    enum?: string[];
    enumDescriptions?: string[];
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
}

export interface SearchableSettingsState {
    filteredSettings: Setting[];
}

const decorate = withStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 800,
        margin: '80px auto 0',
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
}));

const SearchableSettings = decorate(class extends React.PureComponent<EditorProps & WithStyles<'root'>, SearchableSettingsState> {
    componentWillMount() {
        if (!this.state) {
            this.setState({
                filteredSettings: this.props.settings
            });
        }
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <TextField
                    className={this.props.classes.searchInput}
                    label="Search"
                    onChange={this.handleChange()}
                    fullWidth={true}
                />
                <SettingList
                    settings={this.state ? this.state.filteredSettings : this.props.settings}
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
                filteredSettings: this.getFilteredSettings(event.target.value)
            });
        };
    }

    private getFilteredSettings(query: string): Setting[] {
        const queryWords = words(query);
        return this.props.settings.filter(s => {
            return match(s.name, queryWords) || match(s.description, queryWords);
        });
    }
});

const mapStateToProps = state => ({
    settings: state.settings.settings,
    settingOverrides: state.settings.settingOverrides
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
